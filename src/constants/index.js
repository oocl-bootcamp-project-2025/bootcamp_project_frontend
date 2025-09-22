// 中国主要城市数据
export const CHINESE_CITIES = [
  { name: '北京', pinyin: 'beijing', province: '北京市' },
  { name: '上海', pinyin: 'shanghai', province: '上海市' },
  { name: '广州', pinyin: 'guangzhou', province: '广东省' },
  { name: '深圳', pinyin: 'shenzhen', province: '广东省' },
  { name: '杭州', pinyin: 'hangzhou', province: '浙江省' },
  { name: '南京', pinyin: 'nanjing', province: '江苏省' },
  { name: '成都', pinyin: 'chengdu', province: '四川省' },
  { name: '重庆', pinyin: 'chongqing', province: '重庆市' },
  { name: '西安', pinyin: 'xian', province: '陕西省' },
  { name: '武汉', pinyin: 'wuhan', province: '湖北省' },
  { name: '天津', pinyin: 'tianjin', province: '天津市' },
  { name: '苏州', pinyin: 'suzhou', province: '江苏省' },
  { name: '青岛', pinyin: 'qingdao', province: '山东省' },
  { name: '长沙', pinyin: 'changsha', province: '湖南省' },
  { name: '大连', pinyin: 'dalian', province: '辽宁省' },
  { name: '厦门', pinyin: 'xiamen', province: '福建省' },
  { name: '无锡', pinyin: 'wuxi', province: '江苏省' },
  { name: '福州', pinyin: 'fuzhou', province: '福建省' },
  { name: '济南', pinyin: 'jinan', province: '山东省' },
  { name: '昆明', pinyin: 'kunming', province: '云南省' },
  { name: '哈尔滨', pinyin: 'haerbin', province: '黑龙江省' },
  { name: '石家庄', pinyin: 'shijiazhuang', province: '河北省' },
  { name: '合肥', pinyin: 'hefei', province: '安徽省' },
  { name: '郑州', pinyin: 'zhengzhou', province: '河南省' },
  { name: '长春', pinyin: 'changchun', province: '吉林省' },
  { name: '沈阳', pinyin: 'shenyang', province: '辽宁省' },
  { name: '南昌', pinyin: 'nanchang', province: '江西省' },
  { name: '贵阳', pinyin: 'guiyang', province: '贵州省' },
  { name: '太原', pinyin: 'taiyuan', province: '山西省' },
  { name: '南宁', pinyin: 'nanning', province: '广西壮族自治区' },
  { name: '海口', pinyin: 'haikou', province: '海南省' },
  { name: '三亚', pinyin: 'sanya', province: '海南省' },
  { name: '拉萨', pinyin: 'lasa', province: '西藏自治区' },
  { name: '乌鲁木齐', pinyin: 'wulumuqi', province: '新疆维吾尔自治区' },
  { name: '银川', pinyin: 'yinchuan', province: '宁夏回族自治区' },
  { name: '呼和浩特', pinyin: 'huhehaote', province: '内蒙古自治区' },
  { name: '兰州', pinyin: 'lanzhou', province: '甘肃省' },
  { name: '西宁', pinyin: 'xining', province: '青海省' }
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
  { id: 'niche', label: '小众探索' },
  { id: 'cultural', label: '文化深度' },
  { id: 'food', label: '美食之旅' },
  { id: 'photography', label: '摄影打卡' }
];

// 专家服务类型
export const SERVICE_TYPES = [
  { id: 'guide', name: '导游服务', price: '¥200/天' },
  { id: 'consultation', name: '旅游咨询', price: '¥50/小时' },
  { id: 'planning', name: '行程规划', price: '¥150/次' }
];

// 页面路由常量
export const PAGES = {
  HOME: 'home',
  RESULTS: 'results',
  ATTRACTION_DETAIL: 'attraction-detail',
  EXPERT_PROFILE: 'expert-profile',
  POST_DETAIL: 'post-detail'
};

// 预约状态
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};