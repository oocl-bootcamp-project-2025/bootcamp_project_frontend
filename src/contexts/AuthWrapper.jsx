import { useEffect } from 'react';
import { setAuthCallbacks } from '../components/apis/api-new';
import { AuthProvider, useAuth } from './AuthContext';

// 认证回调设置组件
const AuthCallbackSetter = ({ children }) => {
  const { getToken, logout } = useAuth();

  useEffect(() => {
    // 设置api模块的认证回调函数
    setAuthCallbacks({
      getToken: getToken,
      onTokenExpired: () => {
        console.log('AuthCallbackSetter: Token过期，执行登出');
        logout();
      }
    });
  }, [getToken, logout]);

  return children;
};

// 完整的认证包装器
export const AuthWrapper = ({ children }) => {
  return (
    <AuthProvider>
      <AuthCallbackSetter>
        {children}
      </AuthCallbackSetter>
    </AuthProvider>
  );
};

export default AuthWrapper;
