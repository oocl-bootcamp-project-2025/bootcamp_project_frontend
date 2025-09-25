import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
});


let baseURL = process.env.REACT_APP_BACKEND_BASEURL || 'http://localhost:8080/';

const railWayInstance = axios.create({
  baseURL: baseURL
});

// 添加请求拦截器，为每个请求自动添加 Authorization 请求头
instance.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    // 如果存在 token，则添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header:', config.headers['Authorization']);
      console.log("token:   ", token)
    } else {
      console.log('没有找到token，跳过Authorization header');
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
  }
);

// 添加响应拦截器，处理401未授权错误
instance.interceptors.response.use(
  response => {
    // 响应成功，直接返回
    return response;
  },
  error => {
    console.log('响应拦截器捕获错误:', error);
    
    // 如果是403错误，说明token无效，需要重新登录
    if (error.response?.status === 403) {
      console.log('检测到403错误，token可能无效，清除token并跳转到登录页');

      // 清除无效的token
      localStorage.removeItem('token');
      
      // 获取当前页面路径，用于登录后重定向
      const currentPath = window.location.pathname + window.location.search;
      
      // 如果不是在登录页面，则重定向到登录页面
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export const saveItinerary = async (itineraryData) => {
  return await instance.post('trips', itineraryData);
}

export const getAIPlanningRoute = async (searchData) => {
  // 处理参数
  const area = searchData.destination;
  // preference转为数字数组并拼接成字符串
  const preferenceArr = (searchData.preference || []).map(Number);
  const days = searchData.duration;

  // 构建查询字符串
  const params = new URLSearchParams();
  params.append('area', area);
  params.append('preference', preferenceArr.join(','));
  params.append('days', days);

  // GET请求
  return await instance.get(`route/plannerByAI?${params.toString()}`);
}

export const login = async (userData) => {
  return await instance.post('accounts/login', userData);
}

export const register = async (userData) => {
  return await instance.post('accounts/register', userData);
}

export const getCities = async () => {
  return await instance.post('/cities');
}

export const isLogin = async () => {
  return await instance.get('/accounts/isLogin');
}

// 调试工具函数
export const debugTokenStatus = () => {
  const token = localStorage.getItem('token');
  console.log('=== Token状态调试 ===');
  console.log('当前时间:', new Date().toLocaleString());
  console.log('当前URL:', window.location.href);
  console.log('localStorage中是否有token:', !!token);
  if (token) {
    console.log('Token值:', token);
    console.log('Token长度:', token.length);
  }
  console.log('localStorage所有键:', Object.keys(localStorage));
  console.log('====================');
  return !!token;
};