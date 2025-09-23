import { Check, AlertCircle } from 'lucide-react';
import './css/ResultModal.css';

const ResultModal = ({
  isOpen,
  onClose,
  type = 'success', // 'success' | 'error'
  title,
  message,
  buttonText = '确定'
}) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="result-modal-overlay" onClick={onClose}>
      <div className="result-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 图标区域 */}
        <div className="result-modal-icon-section">
          <div className={`result-modal-icon ${isSuccess ? 'success' : 'error'}`}>
            <div className="result-modal-icon-bg">
              <div className="result-modal-icon-inner">
                {isSuccess ? (
                  <Check className="w-8 h-8" />
                ) : (
                  <AlertCircle className="w-8 h-8" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="result-modal-content">
          <h3 className="result-modal-title">
            {title || (isSuccess ? '操作成功' : '操作失败')}
          </h3>
          {message && (
            <p className="result-modal-message">
              {message}
            </p>
          )}
        </div>

        {/* 按钮区域 */}
        <div className="result-modal-actions">
          <button
            className="result-modal-button"
            onClick={onClose}
            autoFocus
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
