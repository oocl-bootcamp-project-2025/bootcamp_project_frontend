import React, { useEffect } from 'react';
import './css/ResultModal.css';

const LoadingModal = ({ isOpen, onClose, message = 'AI正在智能规划路线，请耐心等待', spinnerColor = '#ff7518' }) => {
  if (!isOpen) return null;

  // 5秒后自动关闭（可选，实际可由父组件控制）
  useEffect(() => {
    if (!isOpen) return;
    // 可选自动关闭逻辑
    // const timer = setTimeout(() => {
    //   onClose && onClose();
    // }, 10000);
    // return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <div className="result-modal-overlay">
      <div className="result-modal-container" onClick={e => e.stopPropagation()}>
        {/* Loading 动画区域 */}
        <div className="result-modal-icon-section">
          <div className="result-modal-icon loading">
            <div className="result-modal-icon-bg">
              <div className="result-modal-icon-inner">
                <span className="loading-spinner" style={{
                  display: 'inline-block',
                  width: 40,
                  height: 40,
                  border: `4px solid ${spinnerColor}`,
                  borderTop: `4px solid #fff`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            </div>
          </div>
        </div>
        {/* 内容区域 */}
        <div className="result-modal-content">
          <h3 className="result-modal-title" style={{ textAlign: 'center' }}>
            {message}
          </h3>
        </div>
      </div>
      {/* Loading 动画的 CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingModal;
