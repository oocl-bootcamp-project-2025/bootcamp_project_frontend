import { useEffect } from 'react';
import { debugTokenStatus } from '../apis/api';

// 在任何页面组件中添加这个useEffect来调试
const TokenDebugHook = () => {
  useEffect(() => {
    // 页面加载时检查token状态
    debugTokenStatus();
    
    // 每5秒检查一次token状态
    const interval = setInterval(() => {
      debugTokenStatus();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
};

export default TokenDebugHook;
