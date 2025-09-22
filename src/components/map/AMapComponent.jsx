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

    // 从上下文中获取选中的天数和过滤后的位置
    const { filteredLocations, selectedDays, uniqueDays, toggleDay, toggleAll } = useJourney();

    // 监听选中天数的变化，调整地图视图
    useEffect(() => {
        // 检查是否有天数选择变化
        const hasSelectedDaysChanged =
            !prevSelectedDays ||
            prevSelectedDays.length !== selectedDays.length ||
            !selectedDays.every(day => prevSelectedDays.includes(day));

        // 如果选中的天数变化且地图已初始化，调整视图
        if (hasSelectedDaysChanged && mapRef.current && filteredLocations.length > 0) {
            console.log("Selected days changed, adjusting map view:", selectedDays);

            // 如果只选择了一天
            if (selectedDays.length === 1) {
                const day = selectedDays[0];
                const dayLocations = filteredLocations.filter(loc => loc.day === day);

                if (dayLocations.length > 0) {
                    // 创建边界对象
                    const bounds = new window.AMap.Bounds();

                    // 将该天的所有景点添加到边界中
                    dayLocations.forEach(location => {
                        if (location.position && location.position.length === 2) {
                            bounds.extend(location.position);
                        }
                    });

                    // 计算中心点
                    const center = bounds.getCenter();

                    // 根据景点数量设置合适的缩放级别
                    const zoom = dayLocations.length === 1 ? 16 :
                                dayLocations.length <= 3 ? 15 : 14;

                    // 设置地图中心和缩放级别
                    mapRef.current.setZoomAndCenter(zoom, center);
                }
            } else {
                // 如果选择了多天或全部，则调整视图以适应所有可见标记
                const bounds = new window.AMap.Bounds();

                // 将所有选中天数的景点添加到边界中
                filteredLocations.forEach(location => {
                    if (location.position && location.position.length === 2) {
                        bounds.extend(location.position);
                    }
                });

                // 使所有标记点都在视图内
                mapRef.current.setFitView(bounds, {
                    padding: [50, 50, 50, 50] // 添加内边距确保所有标记可见
                });
            }

            // 更新之前选中的天数
            setPrevSelectedDays([...selectedDays]);
        }
    }, [selectedDays, filteredLocations]);

    // 更新标记显示
    useEffect(() => {
        if (!mapRef.current || !window.AMap) return; // 如果地图尚未初始化，则返回

        console.log("Filtered locations:", filteredLocations); // 调试日志

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
            filteredLocations.forEach((location) => {
                if (location.position && location.position.length === 2) {
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
                }
            });
        }

        markersRef.current = newMarkers;

        // 如果有标记，调整地图视图以包含所有标记点
        if (newMarkers.length > 0 && (!prevSelectedDays || prevSelectedDays.length === 0)) {
            const bounds = new window.AMap.Bounds();
            newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
            mapRef.current.setFitView(bounds, {
                padding: [50, 50, 50, 50]
            });

            // 初始化之前选中的天数
            setPrevSelectedDays([...selectedDays]);
        }
    }, [filteredLocations]); // 当过滤后的位置变化时，重新执行

    // 初始化地图
    useEffect(() => {
        // 检查AMap是否已加载
        if (!window.AMap) {
            console.error("高德地图 API 未加载！");
            // 可以在这里添加加载地图API的代码
            return;
        }

        console.log("Initializing map..."); // 调试日志

        // 创建地图实例
        const map = new window.AMap.Map('mapContainer', {
            center: [116.397428, 39.909187], // 天安门中心点经纬度
            zoom: 12, // 初始缩放级别
            resizeEnable: true // 是否监控地图容器尺寸变化
        });

        mapRef.current = map;

        // 清理事件监听
        return () => {
            // 清除所有标记
            markersRef.current.forEach(marker => {
                marker.setMap(null);
            });
        };
    }, []); // 空依赖数组确保只在组件挂载时执行一次

    // 切换Journey显示/隐藏的函数
    const toggleJourney = () => {
        setShowJourney(prev => !prev);
    };

    return (
        <div className="amap-container">
            <h1>高德地图标注示例</h1>
            <div id="mapContainer" style={{ width: '100%', height: '500px' }}></div>

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
                                    onChange={toggleAll}
                                />
                                显示全部
                            </label>
                            <div>
                                {uniqueDays.map(day => (
                                    <label key={day}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(day)}
                                            onChange={() => toggleDay(day)}
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
