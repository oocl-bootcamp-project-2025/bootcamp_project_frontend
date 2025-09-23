import { useState } from 'react';
import { X, Phone, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import './css/SaveItineraryModal.css';

const SaveItineraryModal = ({ isOpen, onClose, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // 处理手机号输入，只允许数字且限制11位
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // 只允许数字，并限制为11位
    const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
    setPhoneNumber(numbersOnly);

    // 实时校验
    if (numbersOnly.length > 0 && numbersOnly.length < 11) {
      setPhoneError('手机号必须为11位数字');
    } else if (numbersOnly.length === 11 && !/^1[3-9]\d{9}$/.test(numbersOnly)) {
      setPhoneError('请输入正确的手机号格式');
    } else {
      setPhoneError('');
    }
  };

  const handleSave = async () => {
    if (!phoneNumber.trim()) {
      setPhoneError('请输入手机号码');
      return;
    }

    if (phoneNumber.length !== 11) {
      setPhoneError('手机号必须为11位数字');
      return;
    }

    // 严格的中国手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('请输入正确的手机号码');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(phoneNumber);
      // 保存成功后清空表单并关闭弹窗
      setPhoneNumber('');
      setPhoneError('');
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
      // 保存失败也关闭弹窗，让父组件处理错误显示
      setPhoneNumber('');
      setPhoneError('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPhoneNumber('');
    setPhoneError('');
    onClose();
  };

  const isPhoneValid = phoneNumber.length === 11 && /^1[3-9]\d{9}$/.test(phoneNumber);

  return (
    <div className="save-modal-overlay">
      <div className="save-modal-container">
        <div className="save-modal-header">
          <div className="save-modal-title-section">
            <div className="save-modal-icon">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="save-modal-title-text">
              <h3>保存行程</h3>
              <p>我们将发送行程详情到您的手机</p>
            </div>
          </div>
          <button className="save-modal-close" onClick={handleCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="save-modal-content">
          <div className="phone-input-section">
            <label className="phone-input-label">联系电话</label>
            <div className="phone-input-container">
              <div className="phone-input-wrapper">
                <Phone className="phone-input-icon" />
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="请输入您的手机号码"
                  className={`phone-input ${phoneError ? 'error' : ''}`}
                  maxLength={11}
                />
              </div>
              {phoneError && <div className="phone-error">{phoneError}</div>}
            </div>
            <p className="phone-input-description">
              我们将通过短信发送行程链接，方便您随时查看
            </p>
          </div>

          <div className="privacy-notice">
            <p>
              <strong>隐私保护：</strong> 您的手机号将仅用于发送行程信息，我们承诺
              不会用于其他用途，并严格保护您的隐私安全。
            </p>
          </div>
        </div>

        <div className="save-modal-actions">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="cancel-button"
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            className="confirm-save-button"
            disabled={isLoading || !isPhoneValid}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {isLoading ? '保存中...' : '确定保存'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaveItineraryModal;
