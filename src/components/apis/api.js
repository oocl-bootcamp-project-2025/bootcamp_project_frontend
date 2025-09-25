import axios from 'axios';
import {useNavigate} from "react-router";

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
});

const railWayInstance = axios.create({
  baseURL: 'https://sito-service.up.railway.app/',
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
  return await railWayInstance.get(`route/planner?${params.toString()}`);
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