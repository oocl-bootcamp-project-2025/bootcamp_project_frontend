import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 创建认证上下文
const AuthContext = createContext();

// Token存储的key
const TOKEN_KEY = 'auth_token';

// 认证Provider组件
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // 初始化时从localStorage获取token
    return localStorage.getItem(TOKEN_KEY);
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const navigate = useNavigate();

  // 保存token到localStorage和state
  const saveToken = (newToken) => {
    console.log('AuthContext: 保存token', newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // 清除token
  const clearToken = () => {
    console.log('AuthContext: 清除token');
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
  };

  // 登出并跳转到登录页
  const logout = (redirectTo = null) => {
    clearToken();
    const currentPath = redirectTo || (window.location.pathname + window.location.search);
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  // 获取当前token
  const getToken = () => {
    return token || localStorage.getItem(TOKEN_KEY);
  };

  // 监听token变化，同步更新认证状态
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken !== token) {
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
    }
  }, [token]);

  // 监听localStorage变化（适用于多标签页同步）
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === TOKEN_KEY) {
        const newToken = e.newValue;
        setToken(newToken);
        setIsAuthenticated(!!newToken);
        console.log('AuthContext: 检测到storage变化', newToken);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    token,
    isAuthenticated,
    saveToken,
    clearToken,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook来使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export default AuthContext;
