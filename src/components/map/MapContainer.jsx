import { useEffect, useMemo, useRef, useState } from 'react';
import './css/MapContainer.css';
import MapCore from './MapCore';
import MapLoadingStates from './MapLoadingStates';
import MapMarkers from './MapMarkers';
import MapRoutes from './MapRoutes';

const MapContainer = ({ selectedTab, itinerary, searchData, routeData }) => {
    const [map, setMap] = useState(null);
    const [showJourney, setShowJourney] = useState(false);
    const [prevSelectedTab, setPrevSelectedTab] = useState(null);
    const [mapError, setMapError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingView, setIsUpdatingView] = useState(false);
    const [allLocations, setAllLocations] = useState([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);

    const updateTimeoutRef = useRef(null);

    // 获取景点坐标的辅助函数（优先使用数据中的经纬度）
    const getAttractionPosition = async (attraction) => {
        // //console.log(`🔍 开始获取景点 "${attraction.name}" 的坐标...`);

        try {
            // 优先使用景点数据中的经纬度字段
            if (attraction.longitude && attraction.latitude) {
                const position = [attraction.longitude, attraction.latitude];
                // //console.log(`✅ 从景点数据直接获取 "${attraction.name}" 坐标:`, position);
                return position;
            }

            // 如果没有经纬度数据，回退到地理编码
            // //console.log(`⚠️ 景点 "${attraction.name}" 没有经纬度数据，尝试地理编码...`);

            // 如果高德地图未加载，返回默认坐标
            if (!window.AMap) {
                console.warn('❌ 高德地图未加载，使用默认坐标');
                return [116.397428, 39.909187];
            }

            // 从本地测试数据获取坐标（作为备用）
            const testPositions = {
                '天安门广场': [116.397428, 39.909187],
                '故宫博物院': [116.403963, 39.917219],
                '长城': [116.570374, 40.432267],
                '颐和园': [116.275147, 39.999984],
                '北海公园': [116.390895, 39.926623],
                '景山公园': [116.397026, 39.927641],
                '圆明园': [116.303511, 40.006626],
                '天坛': [116.407394, 39.883544],
                '雍和宫': [116.420316, 39.952398],
                '王府井': [116.416357, 39.913855],
                '三里屯': [116.4563, 39.9335],
                '鳥巢 (國家體育場)': [116.3906, 39.9917],
                '水立方 (國家游泳中心)': [116.3906, 39.991],
                '長城 (八達嶺)': [116.0119, 40.3588]
            };

            // 如果是测试数据中的景点，直接返回
            if (testPositions[attraction.name]) {
                //console.log(`✅ 从测试数据获取景点 "${attraction.name}" 坐标:`, testPositions[attraction.name]);
                return testPositions[attraction.name];
            }

            // 尝试使用地理编码API
            return new Promise((resolve, reject) => {
                //console.log(`🌐 尝试通过地理编码API获取景点 "${attraction.name}" 坐标...`);

                // API v2.0 直接使用，无需手动加载插件
                if (!window.AMap.Geocoder) {
                    console.error('❌ Geocoder 插件未加载');
                    resolve([116.397428, 39.909187]);
                    return;
                }

                const geocoder = new window.AMap.Geocoder({
                    city: searchData?.destination || '北京',
                    radius: 50000,
                    extensions: 'all'
                });

                //console.log(`📍 开始地理编码查询: "${attraction.name}", 城市: ${searchData?.destination || '北京'}`);

                geocoder.getLocation(attraction.name, (status, result) => {
                    // //console.log(`📋 景点 "${attraction.name}" 地理编码API响应:`, {
                    //     status,
                    //     resultCount: result?.geocodes?.length || 0,
                    //     result
                    // });

                    if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
                        const geocode = result.geocodes[0];
                        const location = geocode.location;
                        const position = [location.lng, location.lat];

                        // //console.log(`🎉 景点 "${attraction.name}" 坐标获取成功:`, position, `地址: ${geocode.formattedAddress}`);
                        resolve(position);
                    } else {
                        // 尝试POI搜索作为备选
                        if (window.AMap.PlaceSearch) {
                            const placeSearch = new window.AMap.PlaceSearch({
                                city: searchData?.destination || '北京',
                                pageSize: 1
                            });

                            placeSearch.search(attraction.name, (searchStatus, searchResult) => {
                                if (searchStatus === 'complete' && searchResult.poiList && searchResult.poiList.pois.length > 0) {
                                    const poi = searchResult.poiList.pois[0];
                                    const position = [poi.location.lng, poi.location.lat];
                                    // //console.log(`🎉 景点 "${attraction.name}" POI搜索成功:`, position);
                                    resolve(position);
                                } else {
                                    console.warn(`❌ 景点 "${attraction.name}" 所有搜索方式都失败，使用默认坐标`);
                                    resolve([116.397428, 39.909187]);
                                }
                            });
                        } else {
                            console.warn(`❌ 景点 "${attraction.name}" 地理编码失败，使用默认坐标`);
                            resolve([116.397428, 39.909187]);
                        }
                    }
                });
            });
        } catch (error) {
            console.error(`💥 获取景点 "${attraction.name}" 坐标时发生异常:`, error);
            return [116.397428, 39.909187];
        }
    };

    // 异步获取所有景点位置信息
    const loadAllLocations = async () => {
        if (!itinerary || !window.AMap) return;

        // //console.log('=== 开始加载景点坐标 ===');
        // //console.log('行程数据:', itinerary);
        setIsLoadingLocations(true);

        try {
            const locations = [];

            for (const [dayKey, dayIndex] of Object.keys(itinerary).map((key, idx) => [key, idx])) {
                const dayAttractions = itinerary[dayKey] || [];
                // //console.log(`处理第${dayIndex + 1}天 (${dayKey})，景点数量: ${dayAttractions.length}`);

                for (const attraction of dayAttractions) {
                    // //console.log(`正在处理景点:`, {
                    //     name: attraction.name,
                    //     longitude: attraction.longitude,
                    //     latitude: attraction.latitude,
                    //     id: attraction.id
                    // });

                    const position = await getAttractionPosition(attraction);

                    locations.push({
                        name: attraction.name,
                        position: position,
                        day: dayIndex + 1,
                        id: attraction.id,
                        attraction: attraction,
                        isCurrentDay: selectedTab === 'overview' || selectedTab === dayKey
                    });

                    // //console.log(`✅ 景点 "${attraction.name}" 坐标设置完成:`, position);
                }
            }

            //console.log('=== 所有景点坐标加载完成 ===', locations);
            setAllLocations(locations);
        } catch (error) {
            console.error('加载景点坐标时出错:', error);
        } finally {
            setIsLoadingLocations(false);
        }
    };

    // 当 itinerary 或地图加载完成时，重新加载坐标
    useEffect(() => {
        if (itinerary && map && window.AMap) {
            loadAllLocations();
        }
    }, [itinerary, map]);

    // 获取当前选中标签对应的景点（用于地图视角调整）
    const getCurrentTabLocations = () => {
        if (selectedTab === 'overview') {
            return allLocations;
        } else {
            // 具体天数模式：只返回当天的景点
            const dayNumber = parseInt(selectedTab.replace('day', ''));
            return allLocations.filter(location => location.day === dayNumber);
        }
    };

    // 当前标签对应的景点（用于地图视角调整）
    const currentTabLocations = useMemo(() => {
        return getCurrentTabLocations();
    }, [selectedTab, allLocations]);

    // 监听选中标签页的变化，调整地图视图
    useEffect(() => {
        // 如果地图出错或未加载，不执行此操作
        if (mapError || !map) return;

        // 防止频繁更新
        if (isUpdatingView) return;

        // 检查是否有标签页选择变化
        const hasSelectedTabChanged = prevSelectedTab !== selectedTab;

        // 如果选中的标签页变化且地图已初始化，调整视图
        if (hasSelectedTabChanged && map && currentTabLocations && currentTabLocations.length > 0) {
            // 设置视图更新标志
            setIsUpdatingView(true);

            // 设置更新超时检测 - 10秒后自动重置状态，避免永久卡住
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            updateTimeoutRef.current = setTimeout(() => {
                console.warn("Map view update timeout - resetting state");
                setIsUpdatingView(false);
                setPrevSelectedTab(selectedTab);
            }, 10000);

            try {
                // 筛选出有效的位置数据
                const validLocations = currentTabLocations.filter(location =>
                    location.position &&
                    location.position.length === 2 &&
                    !isNaN(location.position[0]) &&
                    !isNaN(location.position[1])
                );

                if (validLocations.length === 0) {
                    console.warn("No valid locations found for selected tab:", selectedTab);
                    setIsUpdatingView(false);
                    clearTimeout(updateTimeoutRef.current);
                    return;
                }

                // 调整地图视图
                //console.log("Calling adjustMapView with validLocations:", validLocations);
                adjustMapView(validLocations);

            } catch (error) {
                console.error("Error in map view update:", error);
                setIsUpdatingView(false);
                clearTimeout(updateTimeoutRef.current);
            }
        }

        // 组件卸载时清除定时器
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [selectedTab, currentTabLocations, mapError, isUpdatingView, prevSelectedTab, map]);

    // 调整地图视图的辅助函数
    const adjustMapView = (validLocations) => {
        try {
            //console.log("adjustMapView called with:", validLocations);
            const positions = validLocations
                .filter(loc => loc.position && loc.position.length === 2)
                .map(loc => loc.position);

            //console.log("Filtered positions:", positions);

            if (positions.length > 0) {
                // 计算边界
                let minLng = Math.min(...positions.map(pos => pos[0]));
                let maxLng = Math.max(...positions.map(pos => pos[0]));
                let minLat = Math.min(...positions.map(pos => pos[1]));
                let maxLat = Math.max(...positions.map(pos => pos[1]));

                // 添加一些边距
                const lngPadding = (maxLng - minLng) * 0.1 || 0.01;
                const latPadding = (maxLat - minLat) * 0.1 || 0.01;

                minLng -= lngPadding;
                maxLng += lngPadding;
                minLat -= latPadding;
                maxLat += latPadding;

                //console.log("Calculated bounds:", { minLng, maxLng, minLat, maxLat });

                try {
                    // 直接使用中心点和缩放级别方法，更可靠
                    const centerLng = (minLng + maxLng) / 2;
                    const centerLat = (minLat + maxLat) / 2;

                    // 根据范围大小决定缩放级别
                    const lngRange = maxLng - minLng;
                    const latRange = maxLat - minLat;
                    const maxRange = Math.max(lngRange, latRange);

                    let zoom;
                    // 优化缩放级别计算，确保景点能完整显示
                    if (maxRange > 0.5) zoom = 9;       // 很大范围
                    else if (maxRange > 0.2) zoom = 10; // 大范围
                    else if (maxRange > 0.1) zoom = 11; // 中等范围
                    else if (maxRange > 0.05) zoom = 12; // 较小范围
                    else if (maxRange > 0.02) zoom = 13; // 小范围
                    else if (maxRange > 0.01) zoom = 14; // 很小范围
                    else zoom = 15; // 最小范围

                    // 使用动画平滑过渡到新的中心点和缩放级别
                    map.setZoomAndCenter(zoom, [centerLng, centerLat], false);

                } catch (boundsError) {
                    console.error("Center and zoom method failed:", boundsError);
                }

                // 延迟更新状态，等待地图动画完成
                setTimeout(() => {
                    setIsUpdatingView(false);
                    clearTimeout(updateTimeoutRef.current);
                    setPrevSelectedTab(selectedTab);
                    //console.log("Map view update completed");
                }, 1000);

            } else {
                //console.log("No valid positions found");
                setIsUpdatingView(false);
                clearTimeout(updateTimeoutRef.current);
            }
        } catch (error) {
            console.error("Error adjusting map view:", error);
            setIsUpdatingView(false);
            clearTimeout(updateTimeoutRef.current);
        }
    };

    // 地图准备就绪回调
    const handleMapReady = (mapInstance) => {
        setMap(mapInstance);
    };

    // 地图错误回调
    const handleMapError = (error) => {
        setMapError(error);
    };

    // 地图加载状态回调
    const handleMapLoading = (loading) => {
        setIsLoading(loading);
    };

    // 标记更新回调
    const handleMarkersUpdate = (markers) => {
        // 如果是初始加载，调整视图以包含所有标记点
        if (markers.length > 0 && prevSelectedTab === null) {
            try {
                const bounds = new window.AMap.Bounds();
                markers.forEach(marker => bounds.extend(marker.getPosition()));

                // 检查边界是否有效（有多个点）
                if (markers.length > 1) {
                    try {
                        map.setFitView(bounds, false); // 启用动画
                    } catch (fitViewError) {
                        console.warn("setFitView failed in handleMarkersUpdate, using fallback", fitViewError);
                        // 回退：计算中心点
                        const positions = markers.map(marker => marker.getPosition());
                        const avgLng = positions.reduce((sum, pos) => sum + pos.lng, 0) / positions.length;
                        const avgLat = positions.reduce((sum, pos) => sum + pos.lat, 0) / positions.length;
                        map.setZoomAndCenter(13, [avgLng, avgLat], false);
                    }
                } else if (markers.length === 1) {
                    // 只有一个标记时，直接设置中心点和缩放级别
                    const position = markers[0].getPosition();
                    map.setZoomAndCenter(16, [position.lng, position.lat], false);
                }

                // 初始化之前选中的标签页
                setPrevSelectedTab(selectedTab);
            } catch (error) {
                console.error("Error in handleMarkersUpdate:", error);
            }
        }
    };

    // 重试加载地图
    const handleRetry = () => {
        // 重置状态
        setMap(null);
        setMapError(false);
        setIsLoading(true);
        setPrevSelectedTab(null);

        // 调用地图核心组件的重试函数
        if (window.mapCoreRetry) {
            window.mapCoreRetry();
        }
    };

    // 切换Journey显示/隐藏的函数
    const toggleJourney = () => {
        setShowJourney(prev => !prev);
    };

    return (
        <div className="amap-container">
            <div className="map-wrapper">
                <MapCore
                    onMapReady={handleMapReady}
                    onMapError={handleMapError}
                    onMapLoading={handleMapLoading}
                />

                {/* 只有在地图准备就绪后才渲染标记和路线 */}
                {map && (
                    <>
                        <MapMarkers
                            map={map}
                            locations={allLocations}
                            selectedTab={selectedTab}
                            onMarkersUpdate={handleMarkersUpdate}
                            isUpdatingView={isUpdatingView}
                        />
                        <MapRoutes
                            map={map}
                            locations={allLocations}
                            selectedTab={selectedTab}
                            routeData={routeData}
                        />
                    </>
                )}

                <MapLoadingStates
                    isLoading={isLoading}
                    mapError={mapError}
                    isUpdating={isUpdatingView}
                    onRetry={handleRetry}
                />
            </div>
        </div>
    );
};

export default MapContainer;
