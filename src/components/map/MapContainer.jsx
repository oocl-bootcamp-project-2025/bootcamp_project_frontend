import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card';
import './css/MapContainer.css';
import MapCore from './MapCore';
import MapLoadingStates from './MapLoadingStates';
import MapMarkers from './MapMarkers';
import MapRoutes from './MapRoutes';

const MapContainer = ({ selectedTab, itinerary, searchData }) => {
    const [map, setMap] = useState(null);
    const [showJourney, setShowJourney] = useState(false);
    const [prevSelectedTab, setPrevSelectedTab] = useState(null);
    const [mapError, setMapError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingView, setIsUpdatingView] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const updateTimeoutRef = useRef(null);

    // 根据选中的标签页和行程数据生成位置信息
    const getFilteredLocations = () => {
        if (!itinerary) return [];

        if (selectedTab === 'overview') {
            // 总览模式：显示所有景点
            const allLocations = [];
            Object.keys(itinerary).forEach((dayKey, dayIndex) => {
                const dayAttractions = itinerary[dayKey] || [];
                dayAttractions.forEach((attraction) => {
                    allLocations.push({
                        name: attraction.name,
                        position: getAttractionPosition(attraction.name),
                        day: dayIndex + 1,
                        id: attraction.id,
                        attraction: attraction
                    });
                });
            });
            return allLocations;
        } else {
            // 具体天数模式：只显示当天的景点
            const dayAttractions = itinerary[selectedTab] || [];
            const dayNumber = parseInt(selectedTab.replace('day', ''));
            return dayAttractions.map((attraction) => ({
                name: attraction.name,
                position: getAttractionPosition(attraction.name),
                day: dayNumber,
                id: attraction.id,
                attraction: attraction
            }));
        }
    };

    // 获取景点坐标的辅助函数（这里使用固定坐标，实际项目中应该从数据库获取）
    const getAttractionPosition = (name) => {
        const positions = {
            '天安门广场': [116.397428, 39.909187],
            '故宫博物院': [116.403963, 39.917219],
            '长城': [116.015881, 40.356188],
            '颐和园': [116.275147, 39.999984],
            '北海公园': [116.390895, 39.926623],
            '景山公园': [116.397026, 39.927641],
            '圆明园': [116.303511, 40.006626]
        };
        return positions[name] || [116.397428, 39.909187]; // 默认坐标
    };

    // 使用 useMemo 缓存 filteredLocations，避免不必要的重新计算
    const filteredLocations = useMemo(() => {
        return getFilteredLocations();
    }, [selectedTab, itinerary]);

    // 监控selectedLocation状态变化
    useEffect(() => {
        console.log("selectedLocation state changed:", selectedLocation);
    }, [selectedLocation]);

    // 监听选中标签页的变化，调整地图视图
    useEffect(() => {
        // 如果地图出错或未加载，不执行此操作
        if (mapError || !map) return;

        // 防止频繁更新
        if (isUpdatingView) return;

        // 检查是否有标签页选择变化
        const hasSelectedTabChanged = prevSelectedTab !== selectedTab;

        // 如果选中的标签页变化且地图已初始化，调整视图
        if (hasSelectedTabChanged && map && filteredLocations && filteredLocations.length > 0) {
            // 减少console输出，避免控制台刷屏
            // console.log("Selected tab changed, adjusting map view:", selectedTab);

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
                const validLocations = filteredLocations.filter(location =>
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
                console.log("Calling adjustMapView with validLocations:", validLocations);
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
    }, [selectedTab, filteredLocations, mapError, isUpdatingView, prevSelectedTab, map]);

    // 调整地图视图的辅助函数
    const adjustMapView = (validLocations) => {
        try {
            console.log("adjustMapView called with:", validLocations);
            const positions = validLocations
                .filter(loc => loc.position && loc.position.length === 2)
                .map(loc => loc.position);

            console.log("Filtered positions:", positions);

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

                console.log("Calculated bounds:", { minLng, maxLng, minLat, maxLat });

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

                    console.log("Range analysis - lngRange:", lngRange, "latRange:", latRange, "maxRange:", maxRange, "zoom:", zoom);
                    console.log("Using center and zoom:", [centerLng, centerLat], zoom);
                    map.setZoomAndCenter(zoom, [centerLng, centerLat]);

                } catch (boundsError) {
                    console.error("Center and zoom method failed:", boundsError);
                }

                // 延迟更新状态
                setTimeout(() => {
                    setIsUpdatingView(false);
                    clearTimeout(updateTimeoutRef.current);
                    setPrevSelectedTab(selectedTab);
                    console.log("Map view update completed");
                }, 500);

            } else {
                console.log("No valid positions found");
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
                        map.setFitView(bounds);
                    } catch (fitViewError) {
                        console.warn("setFitView failed in handleMarkersUpdate, using fallback", fitViewError);
                        // 回退：计算中心点
                        const positions = markers.map(marker => marker.getPosition());
                        const avgLng = positions.reduce((sum, pos) => sum + pos.lng, 0) / positions.length;
                        const avgLat = positions.reduce((sum, pos) => sum + pos.lat, 0) / positions.length;
                        map.setZoomAndCenter(13, [avgLng, avgLat]);
                    }
                } else if (markers.length === 1) {
                    // 只有一个标记时，直接设置中心点和缩放级别
                    const position = markers[0].getPosition();
                    map.setZoomAndCenter(16, [position.lng, position.lat]);
                }

                // 初始化之前选中的标签页
                setPrevSelectedTab(selectedTab);
            } catch (error) {
                console.error("Error in handleMarkersUpdate:", error);
            }
        }
    };

    // 处理景点点击事件 - 使用useCallback避免不必要的重新渲染
    const handleLocationClick = useCallback((location) => {
        setSelectedLocation(location);
    }, []);

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
                            locations={filteredLocations}
                            onMarkersUpdate={handleMarkersUpdate}
                            onLocationClick={handleLocationClick}
                            isUpdatingView={isUpdatingView}
                        />
                        <MapRoutes
                            map={map}
                            locations={filteredLocations}
                        />
                    </>
                )}

                <MapLoadingStates
                    isLoading={isLoading}
                    mapError={mapError}
                    isUpdating={isUpdatingView}
                    onRetry={handleRetry}
                />

                {/* 景点信息卡片浮层 */}
                {selectedLocation && (
                    <div className="location-card-overlay" onClick={() => setSelectedLocation(null)}>
                        <div className="location-card-container" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="close-card-button"
                                onClick={() => setSelectedLocation(null)}
                                aria-label="关闭"
                            >
                                ×
                            </button>
                            <Card
                                name={selectedLocation.name}
                                day={selectedLocation.day}
                            />
                            <div style={{ fontSize: '10px', color: '#999', marginTop: '5px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
                                调试: 景点={selectedLocation.name}, 天数={selectedLocation.day}
                            </div>
                        </div>
                    </div>
                )}

                {/* 调试信息显示 */}
                {selectedLocation && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '5px',
                        fontSize: '12px',
                        borderRadius: '3px',
                        zIndex: 1001
                    }}>
                        调试: 已选择 {selectedLocation.name}
                    </div>
                )}
            </div>


        </div>
    );
};

export default MapContainer;
