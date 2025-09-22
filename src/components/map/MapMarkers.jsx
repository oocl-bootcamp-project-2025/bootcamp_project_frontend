import { useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import Card from './Card';
import './css/MapMarkers.css';

const MapMarkers = ({
    map,
    locations,
    onMarkersUpdate,
    onLocationClick,
    isUpdatingView
}) => {
    const markersRef = useRef([]);

    // 更新标记显示
    useEffect(() => {
        if (!map || !window.AMap) {
            return;
        }

        // 简化逻辑：只在真正需要时更新标记
        if (!locations || locations.length === 0) {
            // 如果没有位置数据，清除现有标记
            markersRef.current.forEach(marker => {
                if (marker && typeof marker.setMap === 'function') {
                    marker.setMap(null);
                }
            });
            markersRef.current = [];
            return;
        }

        // 只有当标记数量或位置发生实际变化时才更新
        const shouldUpdate = markersRef.current.length !== locations.length ||
            !markersRef.current.every((marker, index) => {
                const location = locations[index];
                return location && marker.getPosition() &&
                    marker.getPosition().lng === location.position[0] &&
                    marker.getPosition().lat === location.position[1];
            });

        if (shouldUpdate) {
            updateMarkers();
        }

        // 封装标记更新逻辑，方便复用
        function updateMarkers() {
            try {
                // 清除所有现有标记和事件监听器
                markersRef.current.forEach(marker => {
                    if (marker && typeof marker.clearEvents === 'function') {
                        marker.clearEvents(); // 清除所有事件监听器
                    }
                    if (marker && typeof marker.setMap === 'function') {
                        marker.setMap(null); // 从地图移除
                    }
                });
                markersRef.current = [];

                // 创建信息窗口
                const infoWindow = new window.AMap.InfoWindow({
                    isCustom: true,
                    autoMove: true,
                    offset: new window.AMap.Pixel(0, -15)
                });

                // 用于收集所有标记
                let allMarkers = [];

                if (locations && locations.length > 0) {
                    console.log(`Creating ${locations.length} markers`);

                    // 使用同步方式创建标记，确保事件绑定可靠
                    locations.forEach((location, index) => {
                        if (location.position &&
                            location.position.length === 2 &&
                            !isNaN(location.position[0]) &&
                            !isNaN(location.position[1])) {

                            const day = location.day || 1;
                            const marker = new window.AMap.Marker({
                                position: location.position,
                                title: location.name,
                                content: `<div class="marker marker-day-${day}">${location.name.substring(0, 1)}</div>`,
                                offset: new window.AMap.Pixel(-15, -15)
                            });

                            marker.setMap(map);
                            allMarkers.push(marker);

                            // 添加点击事件
                            const handleClick = () => {
                                console.log("=== MARKER CLICKED ===");
                                console.log("Marker clicked:", location.name);
                                console.log("Location data:", location);
                                console.log("onLocationClick function:", onLocationClick);

                                if (onLocationClick && typeof onLocationClick === 'function') {
                                    console.log("Calling onLocationClick...");
                                    onLocationClick(location);
                                    console.log("onLocationClick called successfully");
                                } else {
                                    console.warn("onLocationClick is not available or not a function:", onLocationClick);
                                }
                                console.log("=== CLICK HANDLER END ===");
                            };

                            // 确保事件绑定成功
                            try {
                                marker.on('click', handleClick);
                                console.log(`Click event bound for ${location.name}`);
                            } catch (eventError) {
                                console.error(`Failed to bind click event for ${location.name}:`, eventError);
                            }

                            // 添加悬停事件
                            try {
                                marker.on('mouseover', () => {
                                    const cardContent = ReactDOMServer.renderToString(
                                        <Card name={location.name} day={location.day} />
                                    );
                                    infoWindow.setContent(cardContent);
                                    infoWindow.open(map, location.position);
                                });

                                marker.on('mouseout', () => {
                                    infoWindow.close();
                                });
                            } catch (eventError) {
                                console.error(`Failed to bind hover events for ${location.name}:`, eventError);
                            }

                            console.log(`Marker ${index + 1}/${locations.length} created for ${location.name}`);
                        } else {
                            console.warn("Invalid location position:", location);
                        }
                    });

                    // 同步完成后立即更新
                    console.log(`All ${allMarkers.length} markers created successfully`);
                    markersRef.current = allMarkers;
                    if (onMarkersUpdate) {
                        onMarkersUpdate(allMarkers);
                    }
                }
            } catch (error) {
                console.error("Error updating markers:", error);
            }
        }
    }, [map, locations]); // 移除 onLocationClick 和 isUpdatingView 依赖

    // 组件卸载时清理标记
    useEffect(() => {
        return () => {
            markersRef.current.forEach(marker => {
                if (marker && typeof marker.clearEvents === 'function') {
                    marker.clearEvents(); // 清除所有事件监听器
                }
                if (marker && typeof marker.setMap === 'function') {
                    marker.setMap(null); // 从地图移除
                }
            });
            markersRef.current = [];
        };
    }, []);

    return null; // 这个组件不渲染任何内容，只管理标记
};

export default MapMarkers;