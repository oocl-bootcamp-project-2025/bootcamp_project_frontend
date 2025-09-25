# AuthContext.jsx 和 AuthWrapper.jsx 使用文档

## 1. 文件概览

### AuthContext.jsx

- **作用**: 提供全局认证状态管理
- **功能**: Token 存储、认证状态管理、登录/登出逻辑
- **核心**: React Context + localStorage

### AuthWrapper.jsx

- **作用**: 连接 AuthContext 和 API 层
- **功能**: 设置 API 调用的认证回调函数
- **核心**: 桥接认证系统和 HTTP 拦截器

## 2. AuthContext.jsx 详细分析

### 2.1 核心功能

```jsx
// 1. Token存储常量
const TOKEN_KEY = 'auth_token';

// 2. 状态管理
const [token, setToken] = useState(() => {
  return localStorage.getItem(TOKEN_KEY); // 初始化从localStorage读取
});
const [isAuthenticated, setIsAuthenticated] = useState(!!token);
```

### 2.2 主要方法

#### saveToken() - 保存 Token

```jsx
const saveToken = newToken => {
  console.log('AuthContext: 保存token', newToken);
  localStorage.setItem(TOKEN_KEY, newToken); // 持久化存储
  setToken(newToken); // 更新内存状态
  setIsAuthenticated(true); // 设置认证状态
};
```

**调用时机**: 用户登录成功后

#### clearToken() - 清除 Token

```jsx
const clearToken = () => {
  console.log('AuthContext: 清除token');
  localStorage.removeItem(TOKEN_KEY); // 清除持久化存储
  setToken(null); // 清除内存状态
  setIsAuthenticated(false); // 清除认证状态
};
```

**调用时机**: 用户登出或 Token 过期时

#### logout() - 登出并跳转

```jsx
const logout = (redirectTo = null) => {
  clearToken(); // 清除Token
  const currentPath =
    redirectTo || window.location.pathname + window.location.search;
  navigate(`/login?redirect=${encodeURIComponent(currentPath)}`); // 跳转到登录页
};
```

**调用时机**: 主动登出或 API 返回 401/403 错误时

#### getToken() - 获取 Token

```jsx
const getToken = () => {
  return token || localStorage.getItem(TOKEN_KEY); // 优先内存，后备localStorage
};
```

**调用时机**: API 请求需要 Token 时

### 2.3 副作用监听

#### 监听 Token 状态变化

```jsx
useEffect(() => {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  if (storedToken !== token) {
    setToken(storedToken);
    setIsAuthenticated(!!storedToken);
  }
}, [token]);
```

**作用**: 确保内存状态与 localStorage 同步

#### 监听跨标签页同步

```jsx
useEffect(() => {
  const handleStorageChange = e => {
    if (e.key === TOKEN_KEY) {
      const newToken = e.newValue;
      setToken(newToken);
      setIsAuthenticated(!!newToken);
    }
  };
  window.addEventListener('storage', handleStorageChange);
}, []);
```

**作用**: 实现多标签页认证状态同步

## 3. AuthWrapper.jsx 详细分析

### 3.1 组件结构

```jsx
// 内部组件：设置API回调
const AuthCallbackSetter = ({ children }) => {
  const { getToken, logout } = useAuth(); // 获取AuthContext方法

  useEffect(() => {
    setAuthCallbacks({
      // 设置api-new.js的回调函数
      getToken: getToken,
      onTokenExpired: () => logout(),
    });
  }, [getToken, logout]);

  return children;
};

// 外部导出：完整包装器
export const AuthWrapper = ({ children }) => {
  return (
    <AuthProvider>
      {' '}
      {/* 提供AuthContext */}
      <AuthCallbackSetter>
        {' '}
        {/* 设置API回调 */}
        {children} {/* 渲染子组件 */}
      </AuthCallbackSetter>
    </AuthProvider>
  );
};
```

### 3.2 关键作用

1. **包装 AuthProvider**: 为整个应用提供认证上下文
2. **设置 API 回调**: 连接认证系统和 HTTP 拦截器
3. **统一入口**: 简化应用集成，只需包装一次

## 4. 完整调用链路

### 4.1 初始化流程

```
App启动
    ↓
AuthWrapper包装整个应用
    ↓
AuthProvider创建认证上下文
    ↓ (从localStorage读取token)
AuthCallbackSetter设置API回调
    ↓ (调用setAuthCallbacks)
api-new.js接收回调函数
    ↓
请求拦截器可以获取token
```

### 4.2 登录流程

```
用户在Login.jsx输入账密
    ↓
调用loginApi()获取token
    ↓
调用saveToken(token)
    ↓
AuthContext.saveToken()
    ↓ localStorage.setItem('auth_token', token)
    ↓ setToken(token)
    ↓ setIsAuthenticated(true)
    ↓
后续API调用自动携带token
```

### 4.3 API 请求流程

```
用户操作触发API调用
    ↓
axios请求拦截器执行
    ↓
调用authCallbacks.getToken()
    ↓
调用AuthContext.getToken()
    ↓ return token || localStorage.getItem('auth_token')
    ↓
添加到请求头: Authorization: Bearer {token}
    ↓
发送到后端
```

### 4.4 Token 过期处理

```
后端返回401/403错误
    ↓
axios响应拦截器捕获
    ↓
调用authCallbacks.onTokenExpired()
    ↓
调用AuthContext.logout()
    ↓
AuthContext.clearToken()
    ↓ localStorage.removeItem('auth_token')
    ↓ setToken(null)
    ↓ setIsAuthenticated(false)
    ↓
navigate('/login?redirect=...')
```

## 5. 使用方式

### 5.1 在 App.jsx 中集成

```jsx
import { AuthWrapper } from './contexts/AuthWrapper';

function App() {
  return (
    <AuthWrapper>
      {/* 你的应用组件 */}
      <RouterProvider router={router} />
    </AuthWrapper>
  );
}
```

### 5.2 在组件中使用认证

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, token, saveToken, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  return <div>欢迎用户: {token}</div>;
};
```

### 5.3 在 API 调用中自动使用

```jsx
// 不需要手动添加token，拦截器自动处理
import { saveItinerary } from './apis/api-new';

const handleSave = async () => {
  try {
    await saveItinerary(data); // 自动携带Authorization头
    console.log('保存成功');
  } catch (error) {
    // 如果是401错误，会自动跳转登录页
    console.error('保存失败', error);
  }
};
```

## 6. 关键设计优势

### 6.1 解耦设计

- **AuthContext**: 专注认证状态管理
- **AuthWrapper**: 专注 API 集成
- **api-new.js**: 专注 HTTP 请求处理

### 6.2 数据持久化

- **内存状态**: 快速访问，应用运行期有效
- **localStorage**: 持久化存储，页面刷新保持登录

### 6.3 多标签页同步

- 通过 storage 事件实现跨标签页状态同步
- 一个标签页登出，其他标签页自动同步

### 6.4 错误处理

- 自动检测 Token 过期(401/403)
- 自动清理失效 Token
- 自动跳转登录页并记录回跳地址

## 7. 调试方法

```jsx
// 查看认证状态
const { token, isAuthenticated } = useAuth();
console.log('Token:', token);
console.log('已认证:', isAuthenticated);

// 手动测试登出
const { logout } = useAuth();
logout('/custom-redirect');

// 检查localStorage
console.log('存储的Token:', localStorage.getItem('auth_token'));
```

这个设计确保了 Token 的安全管理和在整个应用中的一致使用，同时提供了良好的错误处理和用户体验。

# isAuthenticated 完整追踪路径文档

## 1. 定义位置：AuthContext.jsx

### 1.1 初始状态设置

```jsx
// filepath: src/contexts/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  // 🔥 从localStorage读取token初始化
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY);  // TOKEN_KEY = 'auth_token'
  });

  // 🎯 根据token存在与否设置isAuthenticated初始状态
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
```

### 1.2 状态更新机制

```jsx
  // 保存token时更新认证状态
  const saveToken = (newToken) => {
    console.log('AuthContext: 保存token', newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setIsAuthenticated(true);  // 🎯 登录时设为true
  };

  // 清除token时更新认证状态
  const clearToken = () => {
    console.log('AuthContext: 清除token');
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);  // 🎯 登出时设为false
  };

  // 通过Context传递给子组件
  const value = {
    token,
    isAuthenticated,  // 🎯 提供给所有子组件使用
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
```

## 2. 传递路径：通过 Context 传递

### 2.1 应用入口包装

```jsx
// App.jsx 或主入口
<AuthWrapper>
  {' '}
  {/* AuthWrapper包含AuthProvider */}
  <RouterProvider router={router} />
</AuthWrapper>
```

### 2.2 Context Provider 层级

```jsx
// AuthWrapper.jsx
export const AuthWrapper = ({ children }) => {
  return (
    <AuthProvider>
      {' '}
      {/* 🎯 这里提供isAuthenticated给整个应用 */}
      <AuthCallbackSetter>{children}</AuthCallbackSetter>
    </AuthProvider>
  );
};
```

## 3. 接收位置：useExperts.js

### 3.1 Hook 导入和使用

```jsx
// filepath: src/components/modals/hooks/useExperts.js
import { useAuth } from '../../../contexts/AuthContext';

export const useExperts = (attraction, isOpen, onClose, onSelectExpert) => {
  const navigate = useNavigate();

  // 🎯 这里接收isAuthenticated
  const { isAuthenticated, getToken } = useAuth();
```

### 3.2 实际业务逻辑使用

```jsx
// 🎯 在预约处理函数中使用isAuthenticated做判断
const handleBooking = async expert => {
  // 检查是否存在预约
  if (attractionHasBooking) {
    setLinkConfirmVisible(true);
    setSelectedExpertForLink(expert);
    return;
  }

  // 🔥 关键判断：检查用户是否已登录
  if (!isAuthenticated) {
    // 如果未认证
    console.log('用户未登录，显示登录提示');
    setSelectedExpert(expert); // 保存选中的专家信息
    setLoginModalVisible(true); // 显示登录弹窗
    return;
  }

  // 如果已认证，继续预约流程...
  try {
    await isLoginApi(); // 调用后端验证token有效性
    setSelectedExpert(expert);
    setConfirmModalVisible(true);
  } catch (error) {
    console.error('验证登录状态失败:', error);
    setLoginModalVisible(true);
  }
};
```

## 4. isAuthenticated 的核心作用

### 4.1 🔥 主要功能

- **判断用户是否已登录**
- **控制是否显示登录弹窗**
- **决定是否允许执行需要认证的操作**

### 4.2 🎯 具体应用场景

#### 预约流程控制

```jsx
if (!isAuthenticated) {
  setLoginModalVisible(true); // 显示登录弹窗
  return;
}
```

#### 组件渲染控制

```jsx
{
  isAuthenticated ? <UserDashboard /> : <LoginPrompt />;
}
```

#### API 调用前检查

```jsx
if (!isAuthenticated) {
  navigate('/login');
  return;
}
```

#### 条件渲染 UI 元素

```jsx
{
  isAuthenticated && <button onClick={handlePremiumFeature}>高级功能</button>;
}
```

## 5. isAuthenticated 的状态变化时机

### 5.1 状态变化流程图

```
页面加载 → 检查localStorage → 设置初始isAuthenticated
    ↓
用户登录 → saveToken() → setIsAuthenticated(true)
    ↓
Token过期/登出 → clearToken() → setIsAuthenticated(false)
```

### 5.2 详细状态变化

#### 🟢 isAuthenticated = true 的时机

```jsx
// 1. 登录成功时
const saveToken = newToken => {
  setIsAuthenticated(true); // ✅ 登录成功
};

// 2. 页面刷新时localStorage中有有效token
const [isAuthenticated, setIsAuthenticated] = useState(!!token); // ✅ 有token
```

#### 🔴 isAuthenticated = false 的时机

```jsx
// 1. 用户主动登出
const clearToken = () => {
  setIsAuthenticated(false); // ❌ 主动登出
};

// 2. token过期（API返回401/403）
// 在api-new.js的响应拦截器中：
if (error.response?.status === 401) {
  authCallbacks.onTokenExpired(); // 调用logout()
  // → clearToken()
  // → setIsAuthenticated(false)
}

// 3. 首次访问且未登录
const [isAuthenticated, setIsAuthenticated] = useState(!!token); // ❌ 无token

// 4. localStorage被清除
const handleStorageChange = e => {
  if (e.key === TOKEN_KEY && !e.newValue) {
    setIsAuthenticated(false); // ❌ token被删除
  }
};
```

## 6. 完整的数据流

### 6.1 初始化流程

```
页面加载
    ↓
AuthProvider初始化
    ↓ localStorage.getItem('auth_token')
    ↓ setToken(storedToken)
    ↓ setIsAuthenticated(!!storedToken)
    ↓ (通过Context传递)
useExperts接收isAuthenticated
    ↓ const { isAuthenticated } = useAuth();
准备就绪，等待用户操作
```

### 6.2 用户操作流程

```
用户点击"预约达人"按钮
    ↓
handleBooking函数执行
    ↓
检查isAuthenticated状态
    ↓
if (!isAuthenticated) → 显示登录弹窗 → 用户登录 → 自动完成预约
if (isAuthenticated) → 继续预约流程 → 调用后端API
```

### 6.3 认证状态同步流程

```
标签页A用户登录
    ↓ saveToken()
    ↓ localStorage.setItem('auth_token', token)
    ↓ 触发storage事件
    ↓
标签页B监听到storage变化
    ↓ handleStorageChange()
    ↓ setIsAuthenticated(true)
    ↓
所有标签页状态同步
```

## 7. 实际使用示例和最佳实践

### 7.1 在 useExperts 中的完整使用

```jsx
export const useExperts = (attraction, isOpen, onClose, onSelectExpert) => {
  // 获取认证状态
  const { isAuthenticated, getToken } = useAuth();

  const handleBooking = async expert => {
    // Step 1: 前端快速检查认证状态
    if (!isAuthenticated) {
      console.log('前端检查：用户未登录');
      setSelectedExpert(expert);
      setLoginModalVisible(true);
      return;
    }

    // Step 2: 后端验证token有效性（双重验证）
    try {
      console.log('前端检查通过，向后端验证token...');
      await isLoginApi();
      console.log('后端验证通过，继续预约流程');
      setSelectedExpert(expert);
      setConfirmModalVisible(true);
    } catch (error) {
      console.log('后端验证失败，token可能已过期');
      setLoginModalVisible(true);
    }
  };
};
```

### 7.2 其他组件中的使用模式

```jsx
// 路由保护
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 条件渲染
const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <button onClick={logout}>退出登录</button>
      ) : (
        <Link to="/login">登录</Link>
      )}
    </header>
  );
};

// API调用前检查
const useApiCall = () => {
  const { isAuthenticated } = useAuth();

  const callApi = async (apiFunction, ...args) => {
    if (!isAuthenticated) {
      throw new Error('用户未登录');
    }

    return await apiFunction(...args);
  };

  return { callApi };
};
```

## 8. 调试 isAuthenticated 的方法

### 8.1 控制台调试

```jsx
// 在任何组件中添加调试信息
const { isAuthenticated, token } = useAuth();

useEffect(() => {
  console.log('=== 认证状态调试 ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('token存在:', !!token);
  console.log('localStorage中的token:', localStorage.getItem('auth_token'));
  console.log('=====================');
}, [isAuthenticated, token]);
```

### 8.2 React DevTools 调试

- 查找`AuthProvider`组件
- 检查`isAuthenticated`的值
- 观察状态变化的时机

### 8.3 问题排查清单

```jsx
// 1. 检查token是否存在
localStorage.getItem('auth_token');

// 2. 检查AuthProvider是否正确包装
// 确保useAuth()在AuthProvider内部调用

// 3. 检查状态更新逻辑
const { saveToken, clearToken } = useAuth();
console.log('saveToken函数:', typeof saveToken);
console.log('clearToken函数:', typeof clearToken);

// 4. 检查多标签页同步
// 在一个标签页登录，另一个标签页应该同步更新
```

## 9. 注意事项和常见问题

### 9.1 ⚠️ 常见错误

```jsx
// ❌ 错误：直接读取localStorage
const isLoggedIn = !!localStorage.getItem('auth_token');

// ✅ 正确：使用AuthContext
const { isAuthenticated } = useAuth();
```

### 9.2 ⚠️ 时序问题

```jsx
// ❌ 可能有问题：立即使用可能为空
const { isAuthenticated } = useAuth();
if (isAuthenticated) {
  callApiImmediately(); // token可能还未加载完成
}

// ✅ 更安全：等待状态稳定
useEffect(() => {
  if (isAuthenticated) {
    callApi();
  }
}, [isAuthenticated]);
```

### 9.3 📝 最佳实践总结

1. **始终通过 useAuth()获取 isAuthenticated**
2. **前后端双重验证**（前端快速检查 + 后端 token 验证）
3. **合理的错误处理**（网络错误、token 过期、权限不足）
4. **状态同步**（多标签页、页面刷新）
5. **用户体验**（登录弹窗、自动跳转、状态提示）

这个`isAuthenticated`状态是整个认证系统的核心，它连接了前端的用户体验和后端的安全验证，确保了应用的安全性和用户体验的
