import React, { useState, useEffect } from 'react';
import './css/Login.css';
import { login as loginApi } from '../apis/api';
import { useLocation, useNavigate } from 'react-router';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';


// README！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
// 用我，就这样，
// window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
// 或者你用navigate，就这样
// import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();
// navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
// README！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！


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
          console.log('登录成功，token已保存:   ' + token);
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
    <div className="auth-page">
      <div className="login-card">
        {/* 品牌logo */}
        <div className="login-logo">
          <div className="logo-block">
            <span className="logo-brand-text">Sito</span>
          </div>
          <h1 className="logo-text">欢迎回来</h1>
          <p className="logo-subtext">请登录以继续使用服务</p>
        </div>

        {/* 登录表单 */}
        <form className="login-form" onSubmit={handleLogin}>
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
                placeholder="请输入密码，6-16位字母、数字或下划线"
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

          {/* 登录按钮 */}
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>

          {/* 注册入口 */}
          <div className="register-section">
            还没有账号？
            <a href="#" className="register-link" onClick={handleGoRegister}>立即注册</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;