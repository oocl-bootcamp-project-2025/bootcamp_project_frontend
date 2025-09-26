import { register } from '@/components/apis/api-new';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './css/Register.css';

const Register = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState(''); // 新增：手机号验证错误
  const navigate = useNavigate();
  const location = useLocation();

  // 获取redirect参数
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  // 实时验证手机号
  const validatePhoneRealtime = (phoneValue) => {
    if (!phoneValue) {
      setPhoneError('');
      return;
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (phoneValue.length < 11) {
      setPhoneError('手机号长度不足11位');
    } else if (phoneValue.length > 11) {
      setPhoneError('手机号不能超过11位');
    } else if (!/^1/.test(phoneValue)) {
      setPhoneError('手机号必须以1开头');
    } else if (!/^1[3-9]/.test(phoneValue)) {
      setPhoneError('手机号第二位必须是3-9');
    } else if (!/^\d+$/.test(phoneValue)) {
      setPhoneError('手机号只能包含数字');
    } else if (!phoneRegex.test(phoneValue)) {
      setPhoneError('请输入正确的手机号格式');
    } else {
      setPhoneError('');
    }
  };

  // 处理手机号输入
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // 只允许输入数字
    const numericValue = value.replace(/\D/g, '');
    setPhone(numericValue);
    validatePhoneRealtime(numericValue);
    // 清除全局错误信息
    if (error) setError('');
  };

  // 表单验证
  const validateForm = () => {
    // 验证手机号是否符合中国大陆手机号规则
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('请输入正确的手机号码格式（以1开头，第二位为3-9，共11位数字）');
      return false;
    }
    
    // 如果有实时验证错误，也不能提交
    if (phoneError) {
      setError('请先修正手机号格式错误');
      return false;
    }
    
    // 验证密码是否为6-16个字符
    if (!/^\w{6,16}$/.test(password)) {
      setError('请输入有效的密码（6-16位字母、数字或下划线）');
      return false;
    }
    return true;
  };

  // 注册处理（留空，供后续填写）
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      // 发送注册请求
      const response = await register({"phone": phone, "password": password});
      if (response.status === 201) {
        setIsLoading(false);
        // 注册成功，保存手机号到localStorage
        localStorage.setItem('registerPhone', phone);
        message.success('注册成功, 请登录');
        // 注册成功后跳转到登录页，带上redirect参数
        navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      }else {
        message.error('注册失败，未知错误，请重试');
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) {
        setError('请求参数错误，请检查手机号和密码');
      } else if (status === 409) {
        setError('该手机号已被注册，请使用其他手机号或直接登录');
      } else {
        setError('注册失败，请重试');
      }
      setIsLoading(false);
    }
  };

  // 跳转到登录页，带上redirect参数
  const handleGoLogin = (e) => {
    e.preventDefault();
    navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <div className="auth-page">
      <div className="register-card">
        {/* 右上角关闭按钮 */}
        <button
          className="close-login-btn"
          onClick={() => navigate("/")}
          aria-label="关闭注册"
          type="button"
        >
          <span>×</span>
        </button>
        {/* 品牌logo */}
        <div className="register-logo">
          <div className="logo-block">
            <span className="logo-brand-text">Sito</span>
          </div>
          <h1 className="logo-text">创建账号</h1>
          <p className="logo-subtext">注册以开始您的旅行</p>
        </div>

        {/* 注册表单 */}
        <form className="register-form" onSubmit={handleRegister}>
          {/* 显示错误信息 */}
          {error && <div className="error-message">{error}</div>}

          {/* 手机号输入框 */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">手机号</label>
            <div className="input-wrapper">
              <PhoneOutlined className="input-icon" />
              <input
                id="phone"
                type="text"
                className={`form-input ${phoneError ? 'error' : ''}`}
                placeholder="请输入11位手机号码"
                value={phone}
                onChange={handlePhoneChange}
                disabled={isLoading}
                maxLength={11}
              />
            </div>
            {/* 手机号验证错误提示 */}
            {phoneError && (
              <div className="field-error-message" style={{
                color: '#ff4d4f',
                fontSize: '12px',
                marginTop: '4px',
                marginLeft: '8px'
              }}>
                {phoneError}
              </div>
            )}
          </div>

          {/* 密码输入框 */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">密码</label>
            <div className="input-wrapper">
              <LockOutlined className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="请输入6-16位字母、数字或下划线"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                maxLength={16}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '隐藏' : '显示'}
              </button>
            </div>
          </div>

          {/* 注册按钮 */}
          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? '注册中...' : '注册'}
          </button>

          {/* 登录入口 */}
          <div className="login-section">
            已有账号？
            <a href="#" className="login-link" onClick={handleGoLogin}>去登录</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;