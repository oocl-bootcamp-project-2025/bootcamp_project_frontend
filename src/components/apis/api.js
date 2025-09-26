import axios from 'axios';

export const baseURL = () => {
  const hostname = window.location.hostname;
  // if (hostname.includes("localhost")) {
  //   return "http://localhost:8080/";
  // }
  if (hostname.includes("production")) {
    return "https://sito-web-service-backend-production.up.railway.app/"
  }
  else {
    return "https://sito-service.up.railway.app/"
  }
}

const instance = axios.create({
  baseURL: baseURL(),
});


const railWayInstance = axios.create({
  baseURL: baseURL(),
});

// 添加请求拦截器，为每个请求自动添加 Authorization 请求头
instance.interceptors.request.use(
  config => {
    console.log('=== 请求拦截器 ===');
    console.log('请求URL:', config.baseURL + config.url);
    console.log('请求方法:', config.method);

    // 从 localStorage 获取 token（使用与 AuthContext 一致的key）
    const token = localStorage.getItem('auth_token');
    console.log('从localStorage获取的token:', token);

    // 如果存在 token，则添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('已添加Authorization header:', config.headers['Authorization']);
      console.log('完整的请求headers:', config.headers);

      setTimeout(() => {
        console.log('请求拦截器延时测试');
      }, 100000);
    } else {
      console.log('没有找到token，跳过Authorization header');
      setTimeout(() => {
        console.log('请求拦截器无token延时测试');
      }, 100000);
    }

    console.log('================');
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

export const saveItinerary = async (itineraryData) => {
  return await railWayInstance.post('itineraries', itineraryData);
};

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

export const getPlanningRouteByAttractions = async (attractions, days) => {
  return await railWayInstance.post(`route/plannerByAttractions/${days}`, attractions);
}

export const getItineraryDataByItineraryId = async (id) => {
  return await instance.get(`itineraries/itineraryData/${id}`);
}

export const login = async (userData) => {
  return await instance.post('accounts/login', userData);
}

export const register = async (userData) => {
  return await instance.post('accounts/register', userData);
}

export const getCities = async () => {
  return await instance.get('viewpoints/areas_with_location');
}

export const isLogin = async () => {
  return await instance.get('/accounts/isLogin');
}

export const fetchItineraries = async (phoneNumber) => {
  try {
    const response = await instance.get(`itineraries/${phoneNumber}`);
    console.log("----------------------------------------------------------------------");
    console.log('response:', response);
    return response.data; // 返回响应数据
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    throw error; // 可以选择抛出错误以便调用者处理
  }
};

// 测试API调用函数
export const testTokenApi = async () => {
  console.log('开始测试token API调用...');
  try {
    debugTokenStatus(); // 先检查token状态
    const response = await isLogin();
    console.log('testTokenApi 成功:', response);
    return response;
  } catch (error) {
    console.log('testTokenApi 失败:', error);
    throw error;
  }
};

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