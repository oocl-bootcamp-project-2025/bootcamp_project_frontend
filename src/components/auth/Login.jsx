import React, { useState } from 'react';
import './css/Login.css';
import logo from '../../assets/logo192.png'; // 图片路径
const Login = () => {
  // 状态管理
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

  // 登录处理（留空，供后续填写）
  const handleLogin = (e) => {
    e.preventDefault();
    // 后续自行添加登录逻辑
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 品牌logo */}
        <div className="login-logo">
          <img src={logo} alt="私途logo" className="logo-image" />
          <h1 className="logo-text">私途</h1>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="login-form">
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
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 注册选项 */}
        <div className="register-section">
          <p>还没有账号? <a href="/register" className="register-link">立即注册</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;