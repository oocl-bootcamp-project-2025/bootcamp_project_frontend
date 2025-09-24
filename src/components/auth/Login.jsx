import React, { useState, useEffect } from 'react';
import './css/Login.css';
import logo from '../../assets/logo192.png'; // 图片路径
import { login as loginApi } from '../apis/api';
import { useLocation, useNavigate } from 'react-router';

const Login = () => {
  // 状态管理
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerMsg, setRegisterMsg] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // 获取redirect参数
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  // 自动填充手机号和显示注册成功提示
  useEffect(() => {
    const regPhone = localStorage.getItem('registerPhone');
    if (regPhone) {
      setPhone(regPhone);
      localStorage.removeItem('registerPhone');
    }
  }, []);

  // 表单验证（留空，供后续填写）
  const validateForm = () => {
    if (!/^[\d]{11}$/.test(phone)) {
      setError('请输入有效的手机号');
      return false;
    }
    if (!/^\w{6,16}$/.test(password)) {
      setError('请输入有效的密码');
      return false;
    }
    return true;
  };

  // 登录处理
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await loginApi({"phone": phone, "password": password});
      if (response.status === 201 || response.status === 200) {
        const token = response?.data;
        if (token) {
          localStorage.setItem('token', token);
          // 登录成功后跳转到redirect
          window.location.href = redirect;
        } else {
          setError('登录成功，但未获取到token');
        }
      } else {
        setError('登录失败，未知响应码');
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) {
        setError('请求参数错误，请检查手机号和密码');
      } else if (status === 404) {
        setError('用户不存在，请注册或检查手机号');
      } else if (status === 401) {
        setError('密码错误，请重试');
      } else {
        setError('登录失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 跳转到注册页，带上redirect参数
  const handleGoRegister = (e) => {
    e.preventDefault();
    navigate(`/register?redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 品牌logo */}
        <div className="login-logo">
          <img src={logo} alt="私途logo" className="logo-image" />
          <h1 className="logo-text">欢迎回来</h1>
          <h6 className="logo-subtext">登录您的 Sito 账号</h6>
        </div>
        {/* 注册成功提示 */}
        {registerMsg && <div className="success-message">{registerMsg}</div>}
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
          <p>还没有账号? <a href="/register" className="register-link" onClick={handleGoRegister}>立即注册</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;