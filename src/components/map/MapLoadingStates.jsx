import './css/MapLoadingStates.css';

const MapLoadingStates = ({ isLoading, mapError, isUpdating, onRetry }) => {
    // 渲染地图加载错误状态
    const renderMapError = () => (
        <div className="map-error-container">
            <div className="map-error-message">
                <div className="error-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h3>地图加载失败</h3>
                <p>请检查您的网络连接或稍后再试</p>
                <button className="retry-button" onClick={onRetry}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                    重新加载
                </button>
            </div>
        </div>
    );

    // 渲染地图加载中状态
    const renderLoading = () => (
        <div className="map-loading-container">
            <div className="map-loading-spinner"></div>
            <p>地图加载中，请稍候...</p>
        </div>
    );

    // 渲染视图更新中状态
    const renderUpdating = () => (
        <div className="map-updating-overlay">
            <div className="map-updating-indicator"></div>
        </div>
    );

    return (
        <>
            {isLoading && renderLoading()}
            {mapError && renderMapError()}
            {isUpdating && renderUpdating()}
        </>
    );
};

export default MapLoadingStates;
