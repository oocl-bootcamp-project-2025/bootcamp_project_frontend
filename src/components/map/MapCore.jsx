import { useEffect, useRef, useState } from 'react';
import './css/MapCore.css';

const MapCore = ({
    onMapReady,
    onMapError,
    onMapLoading,
    center = [116.397428, 39.909187],
    zoom = 12
}) => {
    const mapRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState(false);

    // 初始化地图
    const initializeMap = () => {
        setIsLoading(true);
        setMapError(false);
        onMapLoading(true);

        // 设置超时检测 - 3分钟后如果地图仍未加载完成则显示重新加载界面
        const timeoutId = setTimeout(() => {
            if (!mapRef.current) {
                console.error("Map loading timeout after 3 minutes");
                setMapError(true);
                setIsLoading(false);
                onMapError(true);
                onMapLoading(false);
            }
        }, 180000); // 180秒（3分钟）超时

        try {
            // 检查AMap是否已加载到全局window对象
            if (!window.AMap) {
                console.error("高德地图 API 未加载！");
                setMapError(true);
                setIsLoading(false);
                onMapError(true);
                onMapLoading(false);
                clearTimeout(timeoutId);
                return;
            }

            //console.log("Initializing map...");

            // 创建地图实例
            const map = new window.AMap.Map('mapContainer', {
                center: center,
                zoom: zoom,
                resizeEnable: true,
                preloadMode: true,
                optimizeRender: true,
                scrollWheel: true,        // 启用鼠标滚轮缩放
                doubleClickZoom: true,    // 启用双击缩放
                keyboardEnable: true,     // 启用键盘控制
                dragEnable: true,         // 启用拖拽平移
                zoomEnable: true,         // 启用缩放功能
                rotateEnable: false,      // 禁用旋转（保持地图正北向上）
                touchZoom: true,          // 启用触摸缩放
                touchZoomCenter: 1        // 触摸缩放以双指中心为缩放中心点
            });

            // 地图加载完成事件
            map.on('complete', () => {
                //console.log("Map loaded successfully");
                setIsLoading(false);
                onMapLoading(false);
                clearTimeout(timeoutId);
                onMapReady(map);
            });

            // 添加错误处理事件监听
            map.on('error', (e) => {
                console.error('Map error:', e);
                setMapError(true);
                setIsLoading(false);
                onMapError(true);
                onMapLoading(false);
                clearTimeout(timeoutId);
            });

            mapRef.current = map;

            // 确保地图容器能接收滚轮事件并阻止事件冒泡
            const mapContainer = document.getElementById('mapContainer');
            if (mapContainer) {
                mapContainer.style.pointerEvents = 'auto';

                // 添加滚轮事件监听器，确保地图缩放功能
                const handleWheel = (e) => {
                    e.stopPropagation(); // 阻止事件冒泡到父级元素
                };

                mapContainer.addEventListener('wheel', handleWheel, { passive: false });

                // 存储清理函数
                mapRef.current._wheelCleanup = () => {
                    mapContainer.removeEventListener('wheel', handleWheel);
                };
            }

            // 返回清理函数
            return () => {
                // 清理滚轮事件监听器
                if (mapRef.current && mapRef.current._wheelCleanup) {
                    mapRef.current._wheelCleanup();
                }

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
            console.error("Error initializing map:", error);
            setMapError(true);
            setIsLoading(false);
            onMapError(true);
            onMapLoading(false);
            clearTimeout(timeoutId);
        }
    };

    // 重试加载地图
    const handleRetry = () => {
        // 清除之前的地图实例
        if (mapRef.current) {
            mapRef.current.destroy();
            mapRef.current = null;
        }

        // 重新初始化地图
        initializeMap();
    };

    // 初始化地图
    useEffect(() => {
        const cleanup = initializeMap();
        return cleanup;
    }, []);

    // 暴露重试函数给父组件
    useEffect(() => {
        if (window.mapCoreRetry) {
            window.mapCoreRetry = handleRetry;
        } else {
            window.mapCoreRetry = handleRetry;
        }
    }, []);

    return (
        <div className="map-core">
            <div id="mapContainer"></div>
        </div>
    );
};

export default MapCore;
