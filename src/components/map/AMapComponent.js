import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import Card from './Card'; // 导入 Card 组件
import './AMapComponent.css'; // 导入 CSS 文件

const AMapComponent = () => {
    useEffect(() => {
        const locations = [
            { name: '天安门', position: [116.397128, 39.916527], day: 1 },
            { name: '大观园', position: [116.39476, 39.89509], day: 2 },
            { name: '故宫', position: [116.397128, 39.914889], day: 1 },
            // 更多地点
        ];

        // 创建地图实例
        const map = new window.AMap.Map('mapContainer', {
            center: [116.365868, 39.911455], // 西城区中心点经纬度
            zoom: 12, // 初始缩放级别
        });

        // 用于存储所有标记的坐标
        const markers = [];

        // 创建信息窗口
        const infoWindow = new window.AMap.InfoWindow({
            isCustom: true, // 使用自定义信息窗口
            autoMove: true, // 自动移动到标记位置
        });

        // 添加标注
        locations.forEach((location) => {
            const dayClass = `marker-day-${location.day}`;
            const marker = new window.AMap.Marker({
                position: location.position,
                title: location.name,
                // 使用 CSS 类来设置样式
                content: `<div class="marker ${dayClass}"></div>`,
            });
            marker.setMap(map);
            markers.push(marker.getPosition()); // 存储标记位置

            // 添加鼠标悬停事件
            marker.on('mouseover', () => {
                const cardContent = ReactDOMServer.renderToString(<Card name={location.name} day={location.day} />);
                infoWindow.setContent(cardContent);
                infoWindow.open(map, location.position);
            });

            // 添加鼠标离开事件以关闭信息窗口
            marker.on('mouseout', () => {
                infoWindow.close();
            });
        });

        // 缩放地图以包含所有标记点
        if (markers.length > 0) {
            const bounds = new window.AMap.Bounds();
            markers.forEach(marker => bounds.extend(marker));
            map.setFitView(bounds);
        }

    }, []);

    return (
        <div>
            <h1>高德地图标注示例</h1>
            <div id="mapContainer"></div>
        </div>
    );
};

export default AMapComponent;
