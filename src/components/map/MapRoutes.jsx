import { useEffect, useRef } from 'react';
import './css/MapRoutes.css';

const MapRoutes = ({ map, locations }) => {
    const routeLinesRef = useRef([]);

    // 根据天数获取路线颜色
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

    // 绘制同一天景点之间的路线
    const drawDayRoutes = (locations) => {
        if (!map || !window.AMap) return;

        // 清除之前的路线
        clearAllRoutes();

        // 按天分组位置
        const locationsByDay = {};
        locations.forEach(location => {
            if (!location.position || location.position.length !== 2 ||
                isNaN(location.position[0]) || isNaN(location.position[1])) {
                return; // 跳过无效位置
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

            // 如果该天有至少两个位置，才能画线
            if (dayLocations.length >= 2) {
                // 按照顺序排序位置（如果有序号属性的话）
                dayLocations.sort((a, b) => (a.order || 0) - (b.order || 0));

                // 提取位置坐标
                const path = dayLocations.map(loc => loc.position);

                // 创建一条带有不同天数颜色的折线
                const polyline = new window.AMap.Polyline({
                    path: path,
                    isOutline: true,
                    outlineColor: '#FFFFFF',
                    borderWeight: 2,
                    strokeColor: getRouteColorByDay(parseInt(day)),
                    strokeWeight: 4,
                    strokeStyle: 'solid',
                    strokeDasharray: [10, 5],
                    lineJoin: 'round',
                    lineCap: 'round',
                    zIndex: 50
                });

                // 将线添加到地图上
                polyline.setMap(map);

                // 保存路线引用以便以后清除
                routeLinesRef.current.push(polyline);

                // 如果有导航功能，可以添加以下代码：
                // 创建路线规划实例
                if (window.AMap.Driving) {
                    const driving = new window.AMap.Driving({
                        policy: window.AMap.DrivingPolicy.LEAST_TIME,
                        map: map,
                        hideMarkers: true
                    });

                    // 使用连续的点对规划多段路线
                    for (let i = 0; i < dayLocations.length - 1; i++) {
                        const startPos = dayLocations[i].position;
                        const endPos = dayLocations[i + 1].position;

                        driving.search(
                            new window.AMap.LngLat(startPos[0], startPos[1]),
                            new window.AMap.LngLat(endPos[0], endPos[1]),
                            (status, result) => {
                                if (status === 'complete') {
                                    // 使用路线规划API返回的路线替换直线
                                    result.routes[0].steps.forEach(step => {
                                        const pathSegment = new window.AMap.Polyline({
                                            path: step.path,
                                            strokeColor: getRouteColorByDay(parseInt(day)),
                                            strokeWeight: 6,
                                            strokeOpacity: 0.8,
                                            zIndex: 100
                                        });
                                        pathSegment.setMap(map);
                                        routeLinesRef.current.push(pathSegment);
                                    });

                                    // 隐藏driving生成的路线
                                    driving.setMap(null);
                                } else {
                                    console.warn("路线规划失败:", status);
                                }
                            }
                        );
                    }
                }
            }
        });
    };

    // 监听locations变化，重新绘制路线
    useEffect(() => {
        if (locations && locations.length > 0) {
            drawDayRoutes(locations);
        } else {
            clearAllRoutes();
        }
    }, [map, locations]);

    // 组件卸载时清理路线
    useEffect(() => {
        return () => {
            clearAllRoutes();
        };
    }, []);

    return null; // 这个组件不渲染任何内容，只管理路线
};

export default MapRoutes;
