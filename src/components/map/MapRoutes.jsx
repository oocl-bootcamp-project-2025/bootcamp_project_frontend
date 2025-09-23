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
        console.log('=== MapRoutes.drawDayRoutes 开始 ===');
        console.log('接收到的 locations:', locations);

        if (!map || !window.AMap) {
            console.warn('地图实例或 AMap 未准备好');
            return;
        }

        // 清除之前的路线
        clearAllRoutes();

        // API v2.0 插件应该已经预加载，直接检查
        if (!window.AMap.Driving) {
            console.error('❌ AMap.Driving 插件未加载');
            return;
        }

        console.log('✅ AMap.Driving 插件已可用');

        // 按天分组位置
        const locationsByDay = {};
        locations.forEach(location => {
            console.log('处理景点:', location.name, '坐标:', location.position, '天数:', location.day);

            if (!location.position || location.position.length !== 2 ||
                isNaN(location.position[0]) || isNaN(location.position[1])) {
                console.warn('跳过无效位置:', location.name, location.position);
                return; // 跳过无效位置
            }

            const day = location.day || 1;
            if (!locationsByDay[day]) {
                locationsByDay[day] = [];
            }
            locationsByDay[day].push(location);
        });

        console.log('按天分组结果:', locationsByDay);

        // 为每一天创建路线
        Object.keys(locationsByDay).forEach(day => {
            const dayLocations = locationsByDay[day];
            console.log(`第 ${day} 天的景点:`, dayLocations);

            // 如果该天有至少两个位置，才能画线
            if (dayLocations.length >= 2) {
                // 按照顺序排序位置（如果有序号属性的话）
                dayLocations.sort((a, b) => (a.order || 0) - (b.order || 0));

                // 为每天的景点创建连续的路线规划
                drawRouteForDay(dayLocations, day);
            } else {
                console.log(`第 ${day} 天景点数量不足 (${dayLocations.length})，无法绘制路线`);
            }
        });

        console.log('=== MapRoutes.drawDayRoutes 结束 ===');
    };

    // 为单天景点绘制连续路线
    const drawRouteForDay = (dayLocations, day) => {
        console.log(`🚗 开始为第 ${day} 天绘制连续路线，景点数量: ${dayLocations.length}`);

        // 如果只有两个景点，直接连接
        if (dayLocations.length === 2) {
            const start = dayLocations[0];
            const end = dayLocations[1];
            drawSingleRoute(start.position, end.position, day);
        } else {
            // 多个景点，按顺序连接每两个相邻景点
            for (let i = 0; i < dayLocations.length - 1; i++) {
                const start = dayLocations[i];
                const end = dayLocations[i + 1];
                console.log(`🔗 第 ${day} 天：从 ${start.name} 到 ${end.name}`);
                drawSingleRoute(start.position, end.position, day, i);
            }
        }
    };

    // 绘制单条路线
    const drawSingleRoute = (startPos, endPos, day, segmentIndex = 0) => {
        try {
            const driving = new window.AMap.Driving({
                policy: window.AMap.DrivingPolicy.LEAST_TIME,
                map: null, // 不自动显示，我们手动绘制
                hideMarkers: true,
                autoFitView: false
            });

            const startLngLat = new window.AMap.LngLat(startPos[0], startPos[1]);
            const endLngLat = new window.AMap.LngLat(endPos[0], endPos[1]);

            console.log(`🚗 开始规划第 ${day} 天第 ${segmentIndex + 1} 段路线...`);
            console.log(`📍 起点: [${startPos[0]}, ${startPos[1]}], 终点: [${endPos[0]}, ${endPos[1]}]`);

            // 简化调用，只传起点和终点
            driving.search(startLngLat, endLngLat, (status, result) => {
                console.log(`📋 第 ${day} 天第 ${segmentIndex + 1} 段路线规划结果:`, { status, result });

                if (status === 'complete' && result && result.routes && result.routes[0]) {
                    const route = result.routes[0];
                    console.log(`✅ 第 ${day} 天第 ${segmentIndex + 1} 段路线规划成功`);
                    console.log(`🛣️ 路线信息: 距离=${route.distance}米, 时长=${route.time}秒, 步骤数=${route.steps.length}`);

                    // 绘制详细路线
                    drawDetailedRoute(route, day, segmentIndex);
                } else {
                    console.warn(`⚠️ 第 ${day} 天第 ${segmentIndex + 1} 段路线规划失败，绘制直线`);
                    drawStraightLine([startPos, endPos], day);
                }
            });

        } catch (error) {
            console.error(`💥 第 ${day} 天第 ${segmentIndex + 1} 段路线规划出错:`, error);
            drawStraightLine([startPos, endPos], day);
        }
    };

    // 绘制详细路线（包含所有路径点）
    const drawDetailedRoute = (route, day, segmentIndex) => {
        console.log(`🎨 开始绘制第 ${day} 天第 ${segmentIndex + 1} 段详细路线`);

        // 收集所有路径点
        const allPathPoints = [];

        route.steps.forEach((step, stepIndex) => {
            if (step.path && step.path.length > 0) {
                console.log(`📍 步骤 ${stepIndex + 1}: ${step.instruction}, 路径点数: ${step.path.length}`);
                // 将当前步骤的路径点添加到总路径中
                allPathPoints.push(...step.path);
            }
        });

        console.log(`🗺️ 第 ${day} 天第 ${segmentIndex + 1} 段总路径点数: ${allPathPoints.length}`);

        if (allPathPoints.length > 0) {
            // 使用所有路径点绘制一条完整的路线
            const routeLine = new window.AMap.Polyline({
                path: allPathPoints,
                strokeColor: getRouteColorByDay(parseInt(day)),
                strokeWeight: 5,
                strokeOpacity: 0.8,
                strokeStyle: 'solid',
                zIndex: 100,
                lineJoin: 'round',
                lineCap: 'round',
                // 添加路线动画效果
                strokeDasharray: [0, 0],
                showDir: true // 显示方向箭头
            });

            routeLine.setMap(map);
            routeLinesRef.current.push(routeLine);

            console.log(`✅ 第 ${day} 天第 ${segmentIndex + 1} 段详细路线已添加到地图，包含 ${allPathPoints.length} 个路径点`);
        } else {
            console.warn(`⚠️ 第 ${day} 天第 ${segmentIndex + 1} 段没有有效路径点，无法绘制详细路线`);
        }
    };

    // 备选方案：绘制直线路线
    const drawStraightLine = (path, day) => {
        console.log(`绘制第 ${day} 天的直线路线作为备选方案`);

        if (path.length >= 2) {
            const polyline = new window.AMap.Polyline({
                path: path,
                strokeColor: getRouteColorByDay(parseInt(day)),
                strokeWeight: 3,
                strokeOpacity: 0.6,
                strokeStyle: 'dashed', // 虚线表示这是直线距离
                zIndex: 90
            });

            polyline.setMap(map);
            routeLinesRef.current.push(polyline);
            console.log(`✅ 第 ${day} 天直线路线已添加到地图`);
        }
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
