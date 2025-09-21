import React, { useEffect, useRef } from 'react';
import AMapJS from 'amap-js';

const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
};

const defaultCenter = {
    lng: 116.397428,
    lat: 39.90923,
};

const Map: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        const key = process.env.REACT_APP_AMAP_KEY || '';
        const securityCode = process.env.REACT_APP_AMAP_SECURITY_CODE || process.env.REACT_APP_AMAP_PASSWORD || '';

        if (!key) {
            console.error('Missing REACT_APP_AMAP_KEY environment variable');
            return;
        }

        let cancelled = false;

        // Prefer using the `amap-js` MapLoader if available
        const loader = new (AMapJS as any).MapLoader({
            key,
            version: '2.0',
            plugins: ['AMap.Marker'],
        });

        loader.load()
            .then(() => {
                if (cancelled) return;
                initMap();
            })
            .catch((err: any) => {
                // Fallback to script injection if MapLoader fails
                console.warn('MapLoader failed, falling back to script load:', err);
                if ((window as any).AMap) {
                    initMap();
                    return;
                }
                const script = document.createElement('script');
                script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}` + (securityCode ? `&securityJsCode=${encodeURIComponent(securityCode)}` : '');
                script.async = true;
                script.onload = () => !cancelled && initMap();
                script.onerror = () => console.error('Failed to load AMap SDK');
                document.head.appendChild(script);
            });

        function initMap() {
            if (!mapRef.current) return;
            try {
                const AMap = (window as any).AMap;
                const map = new AMap.Map(mapRef.current, {
                    center: [defaultCenter.lng, defaultCenter.lat],
                    zoom: 12,
                });
                mapInstanceRef.current = map;

                const marker = new AMap.Marker({
                    position: new AMap.LngLat(defaultCenter.lng, defaultCenter.lat),
                });
                marker.setMap(map);
            } catch (err) {
                console.error('Error initializing AMap:', err);
            }
        }

        return () => {
            cancelled = true;
            try {
                if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
                    mapInstanceRef.current.destroy();
                }
            } catch (err) {
                // ignore
            }
        };
    }, []);

    return <div ref={mapRef} style={containerStyle} />;
};

export default Map;
