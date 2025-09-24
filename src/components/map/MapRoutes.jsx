import { useEffect, useRef } from 'react';
import './css/MapRoutes.css';

const MapRoutes = ({ map, locations, routeData }) => {
    const routeLinesRef = useRef([]);

    // 清除所有路线
    const clearAllRoutes = () => {
        if (routeLinesRef.current.length > 0) {
            routeLinesRef.current.forEach(line => {
                if (line) {
                    line.setMap(null);
                }
            });
            routeLinesRef.current = [];
        }
    };

    // 解析polyline字符串为坐标数组
    const parsePolyline = (polylineStr) => {
        if (!polylineStr) return [];

        const points = polylineStr.split(';');
        return points.map(point => {
            const [lng, lat] = point.split(',').map(Number);
            return [lng, lat];
        }).filter(point => !isNaN(point[0]) && !isNaN(point[1]));
    };

    // 使用testdata2中的route数据绘制驾车路线
    const drawDrivingRoute = (routeData) => {
        console.log('=== MapRoutes.drawDrivingRoute 开始 ===');
        console.log('接收到的 routeData:', routeData);

        if (!map || !window.AMap || !routeData) {
            console.warn('地图实例、AMap 或路线数据未准备好');
            return;
        }

        // 清除之前的路线
        clearAllRoutes();

        try {
            // 获取路线的起点和终点信息
            const { origin, destination, paths } = routeData;
            console.log(`🚗 开始绘制驾车路线: 起点=${origin}, 终点=${destination}, 路径数=${paths?.length || 0}`);

            if (!paths || paths.length === 0) {
                console.warn('⚠️ 没有可用的路径数据');
                return;
            }

            // 使用第一条路径（通常是推荐路径）
            const primaryPath = paths[0];
            console.log(`🛣️ 使用主路径: 距离=${primaryPath.distance}米, 时长=${primaryPath.cost.duration}秒, 步骤数=${primaryPath.steps.length}`);

            // 收集所有路径点
            const allPathPoints = [];

            primaryPath.steps.forEach((step, stepIndex) => {
                if (step.polyline) {
                    const stepPoints = parsePolyline(step.polyline);
                    console.log(`📍 步骤 ${stepIndex + 1}: ${step.instruction}, 路径点数: ${stepPoints.length}`);
                    allPathPoints.push(...stepPoints);
                }
            });

            console.log(`🗺️ 总路径点数: ${allPathPoints.length}`);

            if (allPathPoints.length > 0) {
                // 创建主路线
                const mainRouteLine = new window.AMap.Polyline({
                    path: allPathPoints,
                    strokeColor: '#1890ff', // 蓝色主路线
                    strokeWeight: 6,
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid',
                    zIndex: 100,
                    lineJoin: 'round',
                    lineCap: 'round',
                    showDir: true // 显示方向箭头
                });

                mainRouteLine.setMap(map);
                routeLinesRef.current.push(mainRouteLine);

                // 注释掉起点和终点标记，避免碍眼
                /*
                // 添加起点和终点标记
                if (origin) {
                    const [originLng, originLat] = origin.split(',').map(Number);
                    if (!isNaN(originLng) && !isNaN(originLat)) {
                        const startMarker = new window.AMap.Marker({
                            position: [originLng, originLat],
                            icon: new window.AMap.Icon({
                                image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
                                size: new window.AMap.Size(25, 34),
                                imageOffset: new window.AMap.Pixel(0, 0)
                            }),
                            title: '起点',
                            zIndex: 200
                        });
                        startMarker.setMap(map);
                        routeLinesRef.current.push(startMarker);
                        console.log('✅ 起点标记已添加');
                    }
                }

                if (destination) {
                    const [destLng, destLat] = destination.split(',').map(Number);
                    if (!isNaN(destLng) && !isNaN(destLat)) {
                        const endMarker = new window.AMap.Marker({
                            position: [destLng, destLat],
                            icon: new window.AMap.Icon({
                                image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                                size: new window.AMap.Size(25, 34),
                                imageOffset: new window.AMap.Pixel(0, 0)
                            }),
                            title: '终点',
                            zIndex: 200
                        });
                        endMarker.setMap(map);
                        routeLinesRef.current.push(endMarker);
                        console.log('✅ 终点标记已添加');
                    }
                }
                */

                // 绘制其他可选路径（如果有的话）
                if (paths.length > 1) {
                    paths.slice(1).forEach((path, pathIndex) => {
                        const alternativePoints = [];

                        path.steps.forEach(step => {
                            if (step.polyline) {
                                const stepPoints = parsePolyline(step.polyline);
                                alternativePoints.push(...stepPoints);
                            }
                        });

                        if (alternativePoints.length > 0) {
                            const alternativeLine = new window.AMap.Polyline({
                                path: alternativePoints,
                                strokeColor: '#999999', // 灰色备选路线
                                strokeWeight: 4,
                                strokeOpacity: 0.6,
                                strokeStyle: 'dashed',
                                zIndex: 90,
                                lineJoin: 'round',
                                lineCap: 'round'
                            });

                            alternativeLine.setMap(map);
                            routeLinesRef.current.push(alternativeLine);
                            console.log(`✅ 备选路径 ${pathIndex + 1} 已添加`);
                        }
                    });
                }

                // 调整地图视野以适应路线
                if (allPathPoints.length > 1) {
                    try {
                        const bounds = new window.AMap.Bounds();
                        allPathPoints.forEach(point => {
                            bounds.extend(new window.AMap.LngLat(point[0], point[1]));
                        });
                        map.setFitView(bounds, false, [50, 50, 50, 50]); // 添加边距
                        console.log('✅ 地图视野已调整到路线范围');
                    } catch (error) {
                        console.warn('地图视野调整失败:', error);
                    }
                }

                console.log(`✅ 驾车路线绘制完成，包含 ${allPathPoints.length} 个路径点`);
            } else {
                console.warn('⚠️ 没有有效路径点，无法绘制路线');
            }

        } catch (error) {
            console.error('💥 绘制驾车路线时发生错误:', error);
        }

        console.log('=== MapRoutes.drawDrivingRoute 结束 ===');
    };

    // 根据天数获取路线颜色（保留原有功能作为备用）
    const getRouteColorByDay = (day) => {
        const colors = {
            1: '#ff4757', // 红色 - 第1天
            2: '#2e86de', // 蓝色 - 第2天
            3: '#26de81', // 绿色 - 第3天
            4: '#f368e0', // 粉色 - 第4天
            5: '#ff9f43'  // 橙色 - 第5天
        };
        return colors[day] || '#999999'; // 默认灰色
    };

    // 绘制同一天景点之间的路线（备用功能，如果没有routeData时使用）
    const drawDayRoutes = (locations) => {
        console.log('=== MapRoutes.drawDayRoutes 开始 ===');
        console.log('接收到的 locations:', locations);

        if (!map || !window.AMap) {
            console.warn('地图实例或 AMap 未准备好');
            return;
        }

        // 清除之前的路线
        clearAllRoutes();

        // 按天分组位置
        const locationsByDay = {};
        locations.forEach(location => {
            if (!location.position || location.position.length !== 2 ||
                isNaN(location.position[0]) || isNaN(location.position[1])) {
                console.warn('跳过无效位置:', location.name, location.position);
                return;
            }

            const day = location.day || 1;
            if (!locationsByDay[day]) {
                locationsByDay[day] = [];
            }
            locationsByDay[day].push(location);
        });

        // 为每一天创建路线
        Object.keys(locationsByDay).forEach(day => {
            const dayLocations = locationsByDay[day];
            if (dayLocations.length >= 2) {
                dayLocations.sort((a, b) => (a.order || 0) - (b.order || 0));

                // 创建简单连线
                for (let i = 0; i < dayLocations.length - 1; i++) {
                    const start = dayLocations[i];
                    const end = dayLocations[i + 1];

                    const polyline = new window.AMap.Polyline({
                        path: [start.position, end.position],
                        strokeColor: getRouteColorByDay(parseInt(day)),
                        strokeWeight: 3,
                        strokeOpacity: 0.6,
                        strokeStyle: 'dashed',
                        zIndex: 90
                    });

                    polyline.setMap(map);
                    routeLinesRef.current.push(polyline);
                }
            }
        });

        console.log('=== MapRoutes.drawDayRoutes 结束 ===');
    };

    // 监听routeData和locations变化，重新绘制路线
    useEffect(() => {
        if (routeData) {
            // 优先使用routeData绘制精确的驾车路线
            drawDrivingRoute(routeData);
        } else if (locations && locations.length > 0) {
            // 如果没有routeData，则使用景点位置绘制简单连线
            drawDayRoutes(locations);
        } else {
            clearAllRoutes();
        }
    }, [map, routeData, locations]);

    // 组件卸载时清理路线
    useEffect(() => {
        return () => {
            clearAllRoutes();
        };
    }, []);

    return null; // 这个组件不渲染任何内容，只管理路线
};

export default MapRoutes;
