import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { login as loginApi } from '../apis/api-new';
import './css/Login.css';


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
  
  // 使用认证上下文
  const { saveToken, isAuthenticated } = useAuth();

  // 获取redirect参数
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  const action = searchParams.get('action'); // 获取action参数

  // 处理登录后的待办事项
  const handlePostLoginActions = () => {
    // 检查是否有待处理的预约
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking && action === 'booking') {
      try {
        const bookingData = JSON.parse(pendingBooking);
        // 检查时间戳，如果超过5分钟就过期
        if (Date.now() - bookingData.timestamp < 5 * 60 * 1000) {
          console.log('检测到待处理的预约，准备处理:', bookingData);
          // 清除已保存的预约信息
          sessionStorage.removeItem('pendingBooking');
          
          // 在URL中添加预约信息，让目标页面知道需要自动执行预约
          const redirectUrl = new URL(redirect, window.location.origin);
          redirectUrl.searchParams.set('autoBooking', 'true');
          redirectUrl.searchParams.set('expertId', bookingData.expertId);
          redirectUrl.searchParams.set('attractionId', bookingData.attractionId);
          
          console.log('登录成功，将跳转到预约页面:', redirectUrl.pathname + redirectUrl.search);
          navigate(redirectUrl.pathname + redirectUrl.search);
          return;
        } else {
          console.log('预约信息已过期，清除');
          sessionStorage.removeItem('pendingBooking');
        }
      } catch (error) {
        console.error('处理待办预约时出错:', error);
        sessionStorage.removeItem('pendingBooking');
      }
    }
    
    // 正常跳转
    console.log('登录成功，跳转到:', redirect);
    navigate(redirect);
  };

  // 自动填充手机号和显示注册成功提示
  useEffect(() => {
    // 如果已经登录，直接跳转
    if (isAuthenticated) {
      console.log('用户已登录，跳转到:', redirect);
      navigate(redirect);
      return;
    }
    
    const regPhone = localStorage.getItem('registerPhone');
    if (regPhone) {
      setPhone(regPhone);
      localStorage.removeItem('registerPhone');
    }
  }, [isAuthenticated, redirect, navigate]);

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
      console.log('登录API响应:', response);
      if (response.status === 201 || response.status === 200) {
        const token = response?.data;
        if (token) {
          console.log('登录成功，准备保存token:', token);
          
          // 使用认证系统保存token
          saveToken(token);
          console.log('Token已通过认证系统保存');
          
          // 处理登录后的操作
          handlePostLoginActions();
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