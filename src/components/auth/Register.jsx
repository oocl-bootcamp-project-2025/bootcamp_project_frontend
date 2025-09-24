import React, { useState } from 'react';
import './css/Register.css';
import { register } from '@/components/apis/api';
import { useNavigate, useLocation } from 'react-router';
import { message } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';

const Register = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取redirect参数
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  // 表单验证（留空，供后续填写）
  const validateForm = () => {
    // 后续自行添加验证逻辑
    // 验证输入发手机号是否为11个数字
    if (!/^\d{11}$/.test(phone)) {
      setError('请输入有效的手机号');
      return false;
    }
    // 验证密码是否为6-16个字符
    if (!/^\w{6,16}$/.test(password)) {
      setError('请输入有效的密码');
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
      if (status === 409) {
        message.error('该手机号已被注册');
      }else {
        message.error('注册失败，请重试');
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
    <div className="register-container">
      <div className="register-card">
        {/* 品牌logo */}
        <div className="register-logo">
          <div className="logo-block"><span className="logo-brand-text">Sito</span></div>
        </div>

        {/* 注册表单 */}
        <form onSubmit={handleRegister} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="phone" className="form-label">手机号</label>
            <div className="input-wrapper">
              <span className="input-icon"><PhoneOutlined /></span>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="form-input"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">密码</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockOutlined /></span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="form-input"
                disabled={isLoading}
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

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? '注册中...' : '注册'}
          </button>
        </form>

        {/* 登录选项 */}
        <div className="login-section">
          <p>已有账号? <a href="/login" className="login-link" onClick={handleGoLogin}>立即登录</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;