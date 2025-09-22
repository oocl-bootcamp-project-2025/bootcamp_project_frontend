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
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // 包含出发和返回当天
};

// 过滤城市（支持中文名和拼音搜索）
export const filterCities = (cities, query) => {
  if (!query) return [];
  const searchTerm = query.toLowerCase();
  return cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm) ||
    city.pinyin.toLowerCase().includes(searchTerm) ||
    city.province.toLowerCase().includes(searchTerm)
  );
};

// 格式化日期
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

// 格式化时间
export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 验证表单数据
export const validateTravelForm = (data) => {
  const errors = {};

  if (!data.destination?.trim()) {
    errors.destination = '请选择目的地';
  }

  if (!data.departureDate) {
    errors.departureDate = '请选择出发日期';
  }

  if (!data.returnDate) {
    errors.returnDate = '请选择返回日期';
  }

  if (data.departureDate && data.returnDate && new Date(data.departureDate) > new Date(data.returnDate)) {
    errors.dateRange = '返回日期不能早于出发日期';
  }

  if (!data.preference || data.preference.length === 0) {
    errors.preference = '请选择至少一个旅行偏好';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};