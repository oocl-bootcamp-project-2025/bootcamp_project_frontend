import { useEffect } from 'react';
import loadingGif from '../../assets/loading.gif';
import './css/ResultModal.css';
import './css/loadingmodal.css';

const LoadingModal = ({ isOpen, onClose, message = 'AI正在智能规划路线', message2 = '请耐心等待...', spinnerColor = '#ff7518' }) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen, onClose]);

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-container" onClick={e => e.stopPropagation()}>
        {/* AI图标 */}
        {/* <div className="loading-modal-ai">🤖</div> */}
        {/* Loading 动画区域 */}
        {/* <div className="loading-modal-spinner-section">
          <div className="loading-modal-spinner-bg">
            <span className="loading-modal-spinner" style={{ borderColor: `${spinnerColor} #fff #ff7518 #ff7518` }} />
          </div>
        </div> */}
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
        {/* 内容区域 */}
        <div className="loading-modal-content">
          <h3 className="loading-modal-title">
            {message}
          </h3>
          <h3 className="loading-modal-title">
            {message2}
          </h3>
          <div className="loading-modal-desc">
            预计需要1分钟左右，请耐心等待AI为您生成专属路线
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
