import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { debugTokenStatus, testTokenApi } from '../apis/api-new';

const TokenTestPage = () => {
  const { token, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    console.log('TokenTestPage mounted');
    debugTokenStatus();
  }, []);

  const handleTestApi = async () => {
    try {
      console.log('开始测试API...');
      const response = await testTokenApi();
      console.log('API测试成功:', response);
      alert('API测试成功！检查控制台查看详情');
    } catch (error) {
      console.error('API测试失败:', error);
      alert('API测试失败！检查控制台查看详情');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Token 测试页面</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">认证状态</h2>
          <p>是否已登录: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? '是' : '否'}
          </span></p>
          <p>Token: <code className="text-sm bg-white p-1 rounded">
            {token ? `${token.substring(0, 30)}...` : '无'}
          </code></p>
        </div>
        
        <div className="space-x-4">
          <button 
            onClick={handleTestApi}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            测试API调用
          </button>
          
          <button 
            onClick={debugTokenStatus}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            调试Token状态
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            登出
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800">使用说明：</h3>
          <ol className="mt-2 text-sm text-blue-700 space-y-1">
            <li>1. 先登录获取token</li>
            <li>2. 点击"测试API调用"验证token是否正确传递</li>
            <li>3. 查看浏览器控制台的详细日志</li>
            <li>4. 检查Network标签中的Authorization头</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TokenTestPage;
