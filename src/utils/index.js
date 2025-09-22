// 生成今天之后的日期选项
export const getDateOptions = (days = 30) => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      value: date.toISOString().split('T')[0],
      label: i === 0 ? '今天' : i === 1 ? '明天' :
        `${date.getMonth() + 1}月${date.getDate()}日`
    });
  }

  return dates;
};

// 计算旅行天数
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return Math.max(1, dayDiff + 1); // 至少1天，包含起始日
};

// 过滤城市
export const filterCities = (cities, searchValue, limit = 8) => {
  if (!searchValue || searchValue.length === 0) return [];

  return cities.filter(city =>
    city.name.includes(searchValue) ||
    city.pinyin.toLowerCase().includes(searchValue.toLowerCase()) ||
    city.province.includes(searchValue)
  ).slice(0, limit);
};

// 格式化日期显示
export const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 格式化时间显示
export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 深拷贝对象
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 防抖函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};