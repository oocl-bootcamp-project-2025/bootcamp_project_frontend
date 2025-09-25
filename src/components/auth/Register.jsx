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
                className="form-input"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                maxLength={11}
              />
            </div>
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