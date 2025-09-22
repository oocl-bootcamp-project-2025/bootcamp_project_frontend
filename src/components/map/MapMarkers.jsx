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
        if (!map || !window.AMap) return;

        console.log("Filtered locations:", locations);

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

                if (locations && locations.length > 0) {
                    // 限制一次性处理的标记数量，避免性能问题
                    const batchSize = 10;
                    const processMarkersBatch = (startIndex) => {
                        const endIndex = Math.min(startIndex + batchSize, locations.length);
                        const batch = locations.slice(startIndex, endIndex);

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
                                    offset: new window.AMap.Pixel(-15, -15)
                                });

                                marker.setMap(map);
                                newMarkers.push(marker);

                                // 添加点击事件
                                marker.on('click', () => {
                                    if (onLocationClick) {
                                        onLocationClick(location);
                                    }
                                });

                                // 添加鼠标悬停事件
                                marker.on('mouseover', () => {
                                    const cardContent = ReactDOMServer.renderToString(
                                        <Card name={location.name} day={location.day} />
                                    );
                                    infoWindow.setContent(cardContent);
                                    infoWindow.open(map, location.position);
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
                        if (endIndex < locations.length) {
                            setTimeout(() => {
                                processMarkersBatch(endIndex);
                            }, 0);
                        } else {
                            // 所有批次处理完成，保存标记并通知父组件
                            markersRef.current = newMarkers;
                            onMarkersUpdate(newMarkers);
                        }
                    };

                    // 开始第一批标记处理
                    processMarkersBatch(0);
                }
            } catch (error) {
                console.error("Error updating markers:", error);
            }
        }
    }, [map, locations, onLocationClick, isUpdatingView]);

    // 组件卸载时清理标记
    useEffect(() => {
        return () => {
            markersRef.current.forEach(marker => {
                marker.setMap(null);
            });
            markersRef.current = [];
        };
    }, []);

    return null; // 这个组件不渲染任何内容，只管理标记
};

export default MapMarkers;
