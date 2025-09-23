// 页面常量
export const PAGES = {
  HOME: 'home',
  RESULTS: 'results',
  ATTRACTION_DETAIL: 'attraction_detail',
  EXPERT_PROFILE: 'expert_profile',
  POST_DETAIL: 'post_detail',
  ITINERARY: 'itinerary'
};

// 中国城市数据
export const CHINESE_CITIES = [
  { name: '北京', province: '北京市', pinyin: 'beijing' },
  { name: '上海', province: '上海市', pinyin: 'shanghai' },
  { name: '广州', province: '广东省', pinyin: 'guangzhou' },
  { name: '深圳', province: '广东省', pinyin: 'shenzhen' },
  { name: '杭州', province: '浙江省', pinyin: 'hangzhou' },
  { name: '南京', province: '江苏省', pinyin: 'nanjing' },
  { name: '成都', province: '四川省', pinyin: 'chengdu' },
  { name: '西安', province: '陕西省', pinyin: 'xian' },
  { name: '武汉', province: '湖北省', pinyin: 'wuhan' },
  { name: '重庆', province: '重庆市', pinyin: 'chongqing' },
  { name: '天津', province: '天津市', pinyin: 'tianjin' },
  { name: '苏州', province: '江苏省', pinyin: 'suzhou' },
  { name: '青岛', province: '山东省', pinyin: 'qingdao' },
  { name: '长沙', province: '湖南省', pinyin: 'changsha' },
  { name: '大连', province: '辽宁省', pinyin: 'dalian' },
  { name: '厦门', province: '福建省', pinyin: 'xiamen' },
  { name: '无锡', province: '江苏省', pinyin: 'wuxi' },
  { name: '福州', province: '福建省', pinyin: 'fuzhou' },
  { name: '济南', province: '山东省', pinyin: 'jinan' },
  { name: '宁波', province: '浙江省', pinyin: 'ningbo' }
];

// 时间选项
export const TIME_OPTIONS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

// 旅行偏好选项
export const PREFERENCE_OPTIONS = [
  { id: 'niche', label: '小众探索', icon: 'Compass' },
  { id: 'culture', label: '文化历史', icon: 'Building' },
  { id: 'nature', label: '自然风光', icon: 'Mountain' },
  { id: 'food', label: '美食购物', icon: 'UtensilsCrossed' },
  { id: 'leisure', label: '休闲娱乐', icon: 'Coffee' },
  { id: 'photo', label: '拍照出片', icon: 'Camera' }
];

// API 端点
export const API_ENDPOINTS = {
  SEARCH: '/api/search',
  EXPERTS: '/api/experts',
  BOOKINGS: '/api/bookings',
  ATTRACTIONS: '/api/attractions'
};