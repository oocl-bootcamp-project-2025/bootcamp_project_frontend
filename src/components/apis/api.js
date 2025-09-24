import axios from 'axios';
import {useNavigate} from "react-router";

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
});

const railWayInstance = axios.create({
  baseURL: 'https://sito-service.up.railway.app/',
});

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
  return await railWayInstance.get(`route/planner?${params.toString()}`);
}

export const login = async (userData) => {
  return await instance.post('accounts/login', userData);
}

export const register = async (userData) => {
  return await instance.post('accounts/register', userData);
}