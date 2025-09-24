import React, { useState } from 'react';
import './css/Register.css';
import logo from '../../assets/logo192.png';

const Register = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 表单验证（留空，供后续填写）
  const validateForm = () => {
    // 后续自行添加验证逻辑
    return true;
  };

  // 注册处理（留空，供后续填写）
  const handleRegister = (e) => {
    e.preventDefault();
    // 后续自行添加注册逻辑
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* 品牌logo */}
        <div className="register-logo">
          <img src={logo} alt="私途logo" className="logo-image" />
          <h1 className="logo-text">私途</h1>
        </div>

        {/* 注册表单 */}
        <form onSubmit={handleRegister} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="phone" className="form-label">手机号</label>
            <div className="input-wrapper">
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
          <p>已有账号? <a href="/login" className="login-link">立即登录</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;