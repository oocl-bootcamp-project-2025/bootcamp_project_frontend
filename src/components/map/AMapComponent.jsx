import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Card from './Card'; // 导入 Card 组件
import './css/AMapComponent.css'; // 导入 CSS 文件
import { useJourney } from '../../context/JourneyContext';

const AMapComponent = () => {
    const longPressTimer = useRef(null); // 用于存储长按定时器
    const mapRef = useRef(null); // 用于存储地图实例的引用
    const markersRef = useRef([]); // 用于存储所有标记的引用
    const [showJourney, setShowJourney] = useState(false); // 添加显示/隐藏Journey的状态
    const [prevSelectedDays, setPrevSelectedDays] = useState([]); // 存储上一次选中的天数，用于比较变化
    const [mapError, setMapError] = useState(false); // 新增：存储地图加载错误状态
    const [isLoading, setIsLoading] = useState(true); // 新增：存储地图加载状态
    const [isUpdatingView, setIsUpdatingView] = useState(false); // 新增：标记地图视图是否正在更新
    const updateTimeoutRef = useRef(null); // 用于存储更新超时检测定时器

    // 从上下文中获取选中的天数和过滤后的位置
    const { filteredLocations, selectedDays, uniqueDays, toggleDay, toggleAll } = useJourney();

    // 使用防抖函数限制地图视图更新频率
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // 监听选中天数的变化，调整地图视图 - 添加防抖优化和超时处理
    useEffect(() => {
        // 如果地图出错或未加载，不执行此操作
        if (mapError || !mapRef.current) return;

        // 防止频繁更新
        if (isUpdatingView) return;

        // 检查是否有天数选择变化
        const hasSelectedDaysChanged =
            !prevSelectedDays ||
            prevSelectedDays.length !== selectedDays.length ||
            !selectedDays.every(day => prevSelectedDays.includes(day));

        // 如果选中的天数变化且地图已初始化，调整视图
        if (hasSelectedDaysChanged && mapRef.current && filteredLocations && filteredLocations.length > 0) {
            console.log("Selected days changed, adjusting map view:", selectedDays);

            // 设置视图更新标志
            setIsUpdatingView(true);

            // 设置更新超时检测 - 10秒后自动重置状态，避免永久卡住
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            updateTimeoutRef.current = setTimeout(() => {
                console.warn("Map view update timeout - resetting state");
                setIsUpdatingView(false); // 确保超时后重置状态
                // 强制更新之前选中的天数，以防止持续触发更新
                setPrevSelectedDays([...selectedDays]);
            }, 10000);

            // 创建一个立即执行的视图更新函数 - 移除debounce以解决超时问题
            try {
                // 筛选出有效的位置数据（确保坐标值合法）
                const validLocations = filteredLocations.filter(location =>
                    location.position &&
                    location.position.length === 2 &&
                    !isNaN(location.position[0]) &&
                    !isNaN(location.position[1])
                );

                if (validLocations.length === 0) {
                    console.warn("No valid locations found for selected days:", selectedDays);
                    setIsUpdatingView(false);
                    clearTimeout(updateTimeoutRef.current);
                    return; // 如果没有有效位置，提前返回避免错误
                }

                // 如果只选择了一天
                if (selectedDays.length === 1) {
                    const day = selectedDays[0];
                    const dayLocations = validLocations.filter(loc => loc.day === day);

                    if (dayLocations.length > 0) {
                        // 简化计算方式，提高性能
                        const positions = dayLocations
                            .filter(loc => loc.position && loc.position.length === 2)
                            .map(loc => loc.position);

                        if (positions.length > 0) {
                            try {
                                // 直接设置地图中心和缩放级别，不使用动画和复杂的bounds计算
                                // 计算所有位置的平均值作为中心点
                                const sumLng = positions.reduce((sum, pos) => sum + pos[0], 0);
                                const sumLat = positions.reduce((sum, pos) => sum + pos[1], 0);
                                const centerLng = sumLng / positions.length;
                                const centerLat = sumLat / positions.length;

                                // 根据景点数量设置简单的缩放级别
                                const zoom = positions.length === 1 ? 16 :
                                        positions.length <= 3 ? 15 : 14;

                                // 直接设置地图中心和缩放级别，避免复杂计算
                                mapRef.current.setZoomAndCenter(zoom, [centerLng, centerLat]);

                                // 立即更新完成
                                setIsUpdatingView(false);
                                clearTimeout(updateTimeoutRef.current);
                                // 更新之前选中的天数
                                setPrevSelectedDays([...selectedDays]);
                            } catch (error) {
                                console.error("Error setting map center:", error);
                                setIsUpdatingView(false);
                                clearTimeout(updateTimeoutRef.current);
                            }
                        } else {
                            setIsUpdatingView(false);
                            clearTimeout(updateTimeoutRef.current);
                        }
                    } else {
                        setIsUpdatingView(false);
                        clearTimeout(updateTimeoutRef.current);
                    }
                } else {
                    // 如果选择了多天，简化视图调整
                    try {
                        const positions = validLocations
                            .filter(loc => loc.position && loc.position.length === 2)
                            .map(loc => loc.position);

                        if (positions.length > 0) {
                            // 计算所有位置的平均值作为中心点
                            const sumLng = positions.reduce((sum, pos) => sum + pos[0], 0);
                            const sumLat = positions.reduce((sum, pos) => sum + pos[1], 0);
                            const centerLng = sumLng / positions.length;
                            const centerLat = sumLat / positions.length;

                            // 根据点位数量确定合适的缩放级别
                            const zoom = positions.length <= 2 ? 14 :
                                    positions.length <= 5 ? 13 : 12;

                            // 直接设置地图中心和缩放级别
                            mapRef.current.setZoomAndCenter(zoom, [centerLng, centerLat]);

                            // 立即更新完成
                            setIsUpdatingView(false);
                            clearTimeout(updateTimeoutRef.current);
                            // 更新之前选中的天数
                            setPrevSelectedDays([...selectedDays]);
                        } else {
                            setIsUpdatingView(false);
                            clearTimeout(updateTimeoutRef.current);
                        }
                    } catch (error) {
                        console.error("Error adjusting map for multiple days:", error);
                        setIsUpdatingView(false);
                        clearTimeout(updateTimeoutRef.current);
                    }
                }
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
    }, [selectedDays, filteredLocations, mapError, isUpdatingView, prevSelectedDays]);

    // 更新标记显示 - 优化性能
    useEffect(() => {
        // 如果地图出错或未加载，不执行此操作
        if (mapError || !mapRef.current || !window.AMap) return;

        console.log("Filtered locations:", filteredLocations); // 调试日志

        // 如果正在更新视图，延迟标记更新
        if (isUpdatingView) {
            setTimeout(() => {
                updateMarkers();
            }, 300);
            return;
        }

        updateMarkers();

        // 封装标记更新逻辑，方便复用
        function updateMarkers() {
            try {
                // 清除所有现有标记
                markersRef.current.forEach(marker => {
                    marker.setMap(null);
                });
                markersRef.current = [];

                // 创建信息窗口
                const infoWindow = new window.AMap.InfoWindow({
                    isCustom: true,
                    autoMove: true,
                    offset: new window.AMap.Pixel(0, -15)
                });

                // 添加新标记
                const newMarkers = [];

                if (filteredLocations && filteredLocations.length > 0) {
                    // 限制一次性处理的标记数量，避免性能问题
                    const batchSize = 10;
                    const processMarkersBatch = (startIndex) => {
                        const endIndex = Math.min(startIndex + batchSize, filteredLocations.length);
                        const batch = filteredLocations.slice(startIndex, endIndex);

                        batch.forEach((location) => {
                            // 确保位置坐标有效
                            if (location.position &&
                                location.position.length === 2 &&
                                !isNaN(location.position[0]) &&
                                !isNaN(location.position[1])) {

                                // 为不同天数创建不同颜色的标记
                                const day = location.day || 1;
                                const marker = new window.AMap.Marker({
                                    position: location.position,
                                    title: location.name,
                                    content: `<div class="marker marker-day-${day}">${location.name.substring(0, 1)}</div>`,
                                    offset: new window.AMap.Pixel(-15, -15) // 使标记居中
                                });

                                marker.setMap(mapRef.current);
                                newMarkers.push(marker);

                                // 添加鼠标悬停事件
                                marker.on('mouseover', () => {
                                    const cardContent = ReactDOMServer.renderToString(
                                        <Card name={location.name} day={location.day} />
                                    );
                                    infoWindow.setContent(cardContent);
                                    infoWindow.open(mapRef.current, location.position);
                                });

                                // 添加鼠标离开事件以关闭信息窗口
                                marker.on('mouseout', () => {
                                    infoWindow.close();
                                });
                            } else {
                                console.warn("Invalid location position:", location);
                            }
                        });

                        // 如果还有未处理的标记，安排下一批处理
                        if (endIndex < filteredLocations.length) {
                            setTimeout(() => {
                                processMarkersBatch(endIndex);
                            }, 0);
                        } else {
                            // 所有批次处理完成，保存标记并更新视图
                            markersRef.current = newMarkers;

                            // 如果是初始加载，调整视图以包含所有标记点
                            if (newMarkers.length > 0 && (!prevSelectedDays || prevSelectedDays.length === 0)) {
                                const bounds = new window.AMap.Bounds();
                                newMarkers.forEach(marker => bounds.extend(marker.getPosition()));

                                // 确保边界有效
                                if (!bounds.isEmpty()) {
                                    mapRef.current.setFitView(bounds, {
                                        padding: [50, 50, 50, 50]
                                    });
                                }

                                // 初始化之前选中的天数
                                setPrevSelectedDays([...selectedDays]);
                            }
                        }
                    };

                    // 开始第一批标记处理
                    processMarkersBatch(0);
                }
            } catch (error) {
                console.error("Error updating markers:", error);
                setMapError(true); // 设置地图错误状态
            }
        }
    }, [filteredLocations, mapError, isUpdatingView, selectedDays]); // 当过滤后的位置变化时，重新执行

    // 初始化地图
    const initializeMap = () => {
        setIsLoading(true); // 开始加载
        setMapError(false); // 重置错误状态

        // 设置超时检测 - 3分钟后如果地图仍未加载完成则显示重新加载界面
        const timeoutId = setTimeout(() => {
            if (!mapRef.current) {
                console.error("Map loading timeout after 3 minutes");
                setMapError(true); // 设置地图错误状态为true，触发显示错误界面
                setIsLoading(false); // 关闭加载中状态
            }
        }, 180000); // 180秒（3分钟）超时 - 给予充足的加载时间

        try {
            // 检查AMap是否已加载到全局window对象
            if (!window.AMap) {
                console.error("高德地图 API 未加载！");
                setMapError(true); // 设置地图错误状态
                setIsLoading(false); // 关闭加载中状态
                clearTimeout(timeoutId); // 清除超时检测定时器
                return; // 提前返回，不继续执行
            }

            console.log("Initializing map..."); // 调试日志

            // 创建地图实例
            const map = new window.AMap.Map('mapContainer', {
                center: [116.397428, 39.909187], // 天安门中心点经纬度
                zoom: 12, // 初始缩放级别
                resizeEnable: true, // 是否监控地图容器尺寸变化
                preloadMode: true, // 启用预加载模式
                optimizeRender: true // 优化渲染
            });

            // 地图加载完成事件
            map.on('complete', () => {
                console.log("Map loaded successfully"); // 地图加载成功日志
                setIsLoading(false); // 关闭加载中状态
                clearTimeout(timeoutId); // 清除超时检测定时器
            });

            // 添加错误处理事件监听
            map.on('error', (e) => {
                console.error('Map error:', e); // 记录地图错误
                setMapError(true); // 设置地图错误状态
                setIsLoading(false); // 关闭加载中状态
                clearTimeout(timeoutId); // 清除超时检测定时器
            });

            mapRef.current = map; // 将地图实例保存到ref中

            // 返回清理函数
            return () => {
                // 清除所有标记
                markersRef.current.forEach(marker => {
                    marker.setMap(null);
                });

                // 移除错误事件监听
                map.off('error');
                map.off('complete');

                // 销毁地图实例
                map.destroy();
                mapRef.current = null;

                // 清除超时检测定时器
                clearTimeout(timeoutId);
            };
        } catch (error) {
            // 捕获初始化过程中的任何错误
            console.error("Error initializing map:", error);
            setMapError(true); // 设置地图错误状态
            setIsLoading(false); // 关闭加载中状态
            clearTimeout(timeoutId); // 清除超时检测定时器
        }
    };

    // 初始化地图
    useEffect(() => {
        const cleanup = initializeMap();
        return cleanup;
    }, []); // 空依赖数组确保只在组件挂载时执行一次

    // 重试加载地图
    const handleRetry = () => {
        // 清除之前的地图实例
        if (mapRef.current) {
            markersRef.current.forEach(marker => {
                marker.setMap(null);
            });
            mapRef.current.destroy();
            mapRef.current = null;
        }

        // 重新初始化地图
        initializeMap();

        // 重置选中的天数状态
        setPrevSelectedDays([]);
    };

    // 切换Journey显示/隐藏的函数
    const toggleJourney = () => {
        setShowJourney(prev => !prev);
    };

    // 处理切换特定天数的函数 - 增加错误处理和防抖
    const handleToggleDay = (day) => {
        try {
            // 如果地图视图正在更新，避免重复触发
            if (isUpdatingView) return;

            // 确保不会触发过多的视图更新
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            toggleDay(day);
        } catch (error) {
            console.error(`Error toggling day ${day}:`, error);
        }
    };

    // 处理全选/取消全选的函数 - 增加错误处理和防抖
    const handleToggleAll = () => {
        try {
            // 如果地图视图正在更新，避免重复触发
            if (isUpdatingView) return;

            // 确保不会触发过多的视图更新
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            toggleAll();
        } catch (error) {
            console.error("Error toggling all days:", error);
        }
    };

    // 渲染地图加载错误状态
    const renderMapError = () => (
        <div className="map-error-container">
            <div className="map-error-message">
                <div className="error-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h3>地图加载失败</h3>
                <p>请检查您的网络连接或稍后再试</p>
                <button className="retry-button" onClick={handleRetry}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                    重新加载
                </button>
            </div>
        </div>
    );

    // 渲染地图加载中状态
    const renderLoading = () => (
        <div className="map-loading-container">
            <div className="map-loading-spinner"></div>
            <p>地图加载中，请稍候...</p>
        </div>
    );

    // 渲染视图更新中状态
    const renderUpdating = () => (
        <div className="map-updating-overlay">
            <div className="map-updating-indicator"></div>
        </div>
    );

    return (
        <div className="amap-container">
            <h1>高德地图标注示例</h1>
            <div className="map-wrapper">
                {/* 使用className而非内联样式 */}
                <div id="mapContainer"></div>
                {isLoading && renderLoading()}
                {mapError && renderMapError()}
                {isUpdatingView && renderUpdating()}
            </div>

            {/* 添加按钮控制Journey显示/隐藏 */}
            <button
                className="journey-toggle-btn"
                onClick={toggleJourney}
            >
                {showJourney ? '隐藏行程' : '显示行程'}
            </button>

            {/* 有条件地渲染Journey部分 */}
            {showJourney && (
                <div className="journey-bottom-container">
                    <div className="journey-detail">
                        <h4>路线切换</h4>
                        <div className="day-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedDays.length === uniqueDays.length}
                                    onChange={handleToggleAll}
                                    disabled={isUpdatingView} // 禁用状态
                                />
                                显示全部
                            </label>
                            <div>
                                {uniqueDays.map(day => (
                                    <label key={day}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(day)}
                                            onChange={() => handleToggleDay(day)}
                                            disabled={isUpdatingView} // 禁用状态
                                        />
                                        第{day}天
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AMapComponent;
