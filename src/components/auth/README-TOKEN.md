# Token 流转路径文档

## 1. Token 流转概览

```
用户登录 → API响应Token → AuthContext保存 → localStorage存储 → 请求拦截器获取 → API调用携带
```

## 2. 详细流转路径

### 2.1 登录获取 Token

**文件**: [`src/components/auth/Login.jsx`](src/components/auth/Login.jsx)

```jsx
// 1. 用户提交登录表单
const handleLogin = async e => {
  // 2. 调用登录API
  const response = await loginApi({ phone: phone, password: password });

  // 3. 获取响应中的token
  const token = response?.data;

  // 4. 保存token到认证系统
  saveToken(token);
};
```

### 2.2 Token 保存机制

**文件**: [`src/contexts/AuthContext.jsx`](src/contexts/AuthContext.jsx)

```jsx
// AuthContext中的保存逻辑
const saveToken = newToken => {
  console.log('AuthContext: 保存token', newToken);
  // 1. 保存到localStorage (key: 'auth_token')
  localStorage.setItem(TOKEN_KEY, newToken); // TOKEN_KEY = 'auth_token'
  // 2. 更新内存状态
  setToken(newToken);
  setIsAuthenticated(true);
};
```

### 2.3 Token 获取机制

**文件**: [`src/components/apis/api-new.js`](src/components/apis/api-new.js)

#### 初始化获取方式

```jsx
// 全局认证回调配置
let authCallbacks = {
  getToken: () => localStorage.getItem('auth_token'), // 默认从localStorage获取
  onTokenExpired: null,
};
```

#### 认证系统注册

**文件**: [`src/contexts/AuthWrapper.jsx`](src/contexts/AuthWrapper.jsx)

```jsx
// AuthCallbackSetter组件会设置正确的获取方式
useEffect(() => {
  setAuthCallbacks({
    getToken: getToken, // 使用AuthContext提供的getToken方法
    onTokenExpired: logout,
  });
}, [getToken, logout]);
```

#### AuthContext 的 getToken 方法

**文件**: [`src/contexts/AuthContext.jsx`](src/contexts/AuthContext.jsx)

```jsx
const getToken = () => {
  return token || localStorage.getItem(TOKEN_KEY); // 优先内存，后备localStorage
};
```

### 2.4 API 请求携带 Token

**文件**: [`src/components/apis/api-new.js`](src/components/apis/api-new.js)

```jsx
// 请求拦截器自动添加Authorization头
instance.interceptors.request.use(config => {
  // 1. 通过认证回调获取token
  const token = authCallbacks.getToken();

  // 2. 添加到请求头
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});
```

## 3. Token 存储位置

### 3.1 localStorage

- **Key**: `'auth_token'`
- **位置**: 浏览器 localStorage
- **用途**: 持久化存储，页面刷新后保持登录状态

### 3.2 AuthContext 内存状态

- **变量**: `token` (useState)
- **位置**: React 组件状态
- **用途**: 应用运行时的快速访问

## 4. Token 获取优先级

```jsx
// AuthContext.getToken() 方法的优先级
const getToken = () => {
  return token || localStorage.getItem(TOKEN_KEY);
};
```

1. **第一优先级**: 内存中的`token`状态
2. **第二优先级**: localStorage 中的`'auth_token'`

## 5. Token 失效处理

### 5.1 响应拦截器检测

**文件**: [`src/components/apis/api-new.js`](src/components/apis/api-new.js)

```jsx
instance.interceptors.response.use(
  response => response,
  error => {
    // 检测401/403错误
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 调用认证系统的过期处理
      if (authCallbacks.onTokenExpired) {
        authCallbacks.onTokenExpired(); // 会调用AuthContext.logout()
      }
    }
  }
);
```

### 5.2 登出清理

**文件**: [`src/contexts/AuthContext.jsx`](src/contexts/AuthContext.jsx)

```jsx
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY); // 清除localStorage
  setToken(null); // 清除内存状态
  setIsAuthenticated(false);
};

const logout = (redirectTo = null) => {
  clearToken();
  // 跳转到登录页
  navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
};
```

## 6. 完整调用链

```
Login.jsx (handleLogin)
    ↓ saveToken(token)
AuthContext.jsx (saveToken)
    ↓ localStorage.setItem('auth_token', token)
    ↓ setToken(token)
AuthWrapper.jsx (AuthCallbackSetter)
    ↓ setAuthCallbacks({ getToken: AuthContext.getToken })
api-new.js (请求拦截器)
    ↓ authCallbacks.getToken()
    ↓ AuthContext.getToken()
    ↓ return token || localStorage.getItem('auth_token')
    ↓ headers['Authorization'] = `Bearer ${token}`
后端API调用
```

## 7. 关键文件依赖关系

```
AuthContext.jsx (认证核心)
    ↑ 被 AuthWrapper.jsx 包装
    ↑ 被 Login.jsx 调用 (saveToken)
    ↓ 提供 getToken 给 api-new.js

api-new.js (API调用)
    ↑ 接收 AuthWrapper 设置的回调
    ↓ 使用 authCallbacks.getToken() 获取token
    ↓ 自动添加到所有HTTP请求头
```

## 8. 调试方法

### 8.1 Token 状态检查

```jsx
// 使用调试函数
import { debugTokenStatus } from '../apis/api-new';
debugTokenStatus(); // 输出详细token信息
```

### 8.2 测试页面

访问 `/token-test` 路由查看 token 状态和测试 API 调用。

## 9. 注意事项

1. **Token Key**: 统一使用 `'auth_token'` 作为 localStorage 的 key
2. **获取方式**: 通过 `authCallbacks.getToken()` 而不是直接访问 localStorage
3. **失效处理**: 自动检测 401/403 错误并触发重新登录
4. **多标签页同步**: 通过 localStorage 变化事件实现状态同步
