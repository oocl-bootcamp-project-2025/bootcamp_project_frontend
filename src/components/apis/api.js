import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
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
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
  }
);

export const saveItinerary = async (itineraryData) => {
  return await instance.post('trips', itineraryData);
}

export const getAIPlanningRoute = async (searchData) => {
  return await instance.post('route/process', searchData);
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