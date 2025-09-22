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

            console.log("Initializing map...");

            // 创建地图实例
            const map = new window.AMap.Map('mapContainer', {
                center: center,
                zoom: zoom,
                resizeEnable: true,
                preloadMode: true,
                optimizeRender: true
            });

            // 地图加载完成事件
            map.on('complete', () => {
                console.log("Map loaded successfully");
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

            // 返回清理函数
            return () => {
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
