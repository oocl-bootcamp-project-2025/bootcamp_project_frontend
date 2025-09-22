import React, { useRef, useState, useEffect } from 'react';

const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const containerStyle: React.CSSProperties = {
    width: '100vw',
    height:  '80vh',
};

const defaultCenter = [116.397428, 39.90923];

const Map: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const key = process.env.REACT_APP_AMAP_API_KEY || '';
    const securityJsCode = process.env.REACT_APP_AMAP_CREDENTIAL || '';


    useEffect(() => {
        if (!key) {
            setError('Missing AMap API Key');
            return;
        }

        if (!securityJsCode) {
            setError('Missing AMap Security Code');
            return;
        }

        window._AMapSecurityConfig = {
            securityJsCode: securityJsCode,
        };

        const script = document.createElement('script');
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
        script.async = true;

        script.onload = () => {
            // Initialize map after script is loaded
            if (mapRef.current && window.AMap) {
                const map = new window.AMap.Map(mapRef.current, {
                    zoom: 12,
                    center: defaultCenter,
                });

                new window.AMap.Marker({
                    position: defaultCenter,
                    map: map
                });
            }
        };

        script.onerror = () => {
            setError('Failed to load AMap JS SDK');
        };

        document.head.appendChild(script);

        return () => {
            // Clean up
            document.head.removeChild(script);
        };
    }, [key, securityJsCode]);

    return (
        <div style={wrapperStyle}>
            <div style={containerStyle}>
                {error ? (
                    <div style={{ padding: 12 }}>{error}</div>
                ) : (
                    <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
                )}
            </div>
        </div>
    );
};

declare global {
    interface Window {
        AMap: any;
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}

declare global {
    interface Window {
        AMap: any;
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}

export default Map;