import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useNavigate } from 'react-router';
import Card from './Card'; // 导入 Card 组件
import './css/AMapComponent.css'; // 导入 CSS 文件
import { useJourney } from '../../context/JourneyContext';

const AMapComponent = () => {
    const navigate = useNavigate(); // 获取 navigate 函数
    const longPressTimer = useRef(null); // 用于存储长按定时器
    const mapRef = useRef(null); // 用于存储地图实例的引用
    const markersRef = useRef([]); // 用于存储所有标记的引用
    const [showJourney, setShowJourney] = useState(false); // 添加显示/隐藏Journey的状态

    // 从上下文中获取选中的天数和过滤后的位置
    const { filteredLocations } = useJourney();

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
        if (newMarkers.length > 0) {
            const bounds = new window.AMap.Bounds();
            newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
            mapRef.current.setFitView(bounds);
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

        // 处理长按事件
        const handleLongPressStart = () => {
            longPressTimer.current = setTimeout(() => {
                navigate('/journey'); // 导航到 JourneyDetail 页面
            }, 800); // 设置长按时间
        };

        const handleLongPressEnd = () => {
            clearTimeout(longPressTimer.current); // 清除定时器
        };

        // 添加事件监听
        map.on('mousedown', handleLongPressStart);
        map.on('mouseup', handleLongPressEnd);
        map.on('mouseleave', handleLongPressEnd); // 鼠标离开时清除定时器

        // 清理事件监听
        return () => {
            map.off('mousedown', handleLongPressStart);
            map.off('mouseup', handleLongPressEnd);
            map.off('mouseleave', handleLongPressEnd);

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
                                    checked={useJourney().selectedDays.length === useJourney().uniqueDays.length}
                                    onChange={useJourney().toggleAll}
                                />
                                显示全部
                            </label>
                            <div>
                                {useJourney().uniqueDays.map(day => (
                                    <label key={day}>
                                        <input
                                            type="checkbox"
                                            checked={useJourney().selectedDays.includes(day)}
                                            onChange={() => useJourney().toggleDay(day)}
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
