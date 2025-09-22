import { useState } from 'react';
import { MapPin, Search, Compass, Building, Mountain, UtensilsCrossed, Coffee, Camera, Heart, Calendar, Clock, ChevronDown, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

// 中国主要城市数据
const chineseCities = [
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
const timeOptions = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function Homepage({ onStartPlanning }) {
  const [destination, setDestination] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [showDepartureTime, setShowDepartureTime] = useState(false);
  const [showReturnTime, setShowReturnTime] = useState(false);
  const [preference, setPreference] = useState('');

  const preferenceOptions = [
    { id: 'niche', label: '小众探索', icon: Compass, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'culture', label: '文化历史', icon: Building, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'nature', label: '自然风光', icon: Mountain, color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'food', label: '美食购物', icon: UtensilsCrossed, color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'leisure', label: '休闲娱乐', icon: Coffee, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'photo', label: '拍照出片', icon: Camera, color: 'bg-pink-100 text-pink-700 border-pink-200' }
  ];

  // 处理目的地输入
  const handleDestinationChange = (value) => {
    setDestination(value);
    if (value.length > 0) {
      const filtered = chineseCities.filter(city => 
        city.name.includes(value) || 
        city.pinyin.toLowerCase().includes(value.toLowerCase()) ||
        city.province.includes(value)
      ).slice(0, 8); // 限制显示8个结果
      setFilteredCities(filtered);
      setShowCityDropdown(true);
    } else {
      setShowCityDropdown(false);
      setFilteredCities([]);
    }
  };

  // 选择城市
  const handleCitySelect = (cityName) => {
    setDestination(cityName);
    setShowCityDropdown(false);
    setFilteredCities([]);
  };

  // 生成今天之后的日期选项
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
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

  const dateOptions = getDateOptions();

  const handleStartPlanning = () => {
    if (!destination.trim()) {
      alert('请选择目的地');
      return;
    }
    
    if (!departureDate) {
      alert('请选择出发日期');
      return;
    }

    if (!returnDate) {
      alert('请选择返回日期');
      return;
    }

    if (!preference) {
      alert('请选择旅行偏好');
      return;
    }

    const searchData = {
      destination: destination.trim(),
      departureDate,
      departureTime: departureTime || '09:00',
      returnDate,
      returnTime: returnTime || '18:00',
      preference,
      duration: calculateDuration(departureDate, returnDate)
    };

    if (onStartPlanning) {
      onStartPlanning(searchData);
    }
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <Heart className="inline-block w-8 h-8 mr-2 text-red-500" />
          AI 旅行规划
        </h1>
        <p className="text-gray-600">
          让AI为您规划完美的旅程
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          
          {/* 目的地选择 */}
          <div className="relative">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              目的地
            </label>
            <div className="relative">
              <Input
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                placeholder="搜索城市名称或拼音"
                className="w-full"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* 城市下拉选择 */}
            {showCityDropdown && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-sm text-gray-500">{city.province}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 出发时间 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                出发日期
              </label>
              <select
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">选择日期</option>
                {dateOptions.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                出发时间
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowDepartureTime(!showDepartureTime)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between"
                >
                  {departureTime || '选择时间'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showDepartureTime && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                    {timeOptions.map((time) => (
                      <div
                        key={time}
                        onClick={() => {
                          setDepartureTime(time);
                          setShowDepartureTime(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 返回时间 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                返回日期
              </label>
              <select
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">选择日期</option>
                {dateOptions.slice(1).map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                返回时间
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowReturnTime(!showReturnTime)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between"
                >
                  {returnTime || '选择时间'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showReturnTime && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                    {timeOptions.map((time) => (
                      <div
                        key={time}
                        onClick={() => {
                          setReturnTime(time);
                          setShowReturnTime(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 旅行偏好 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4 mr-2 text-pink-500" />
              旅行偏好 (选择一项)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {preferenceOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPreference(option.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      preference === option.id
                        ? `${option.color} border-current`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 开始规划按钮 */}
          <Button
            onClick={handleStartPlanning}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            开始规划我的旅程
          </Button>

          {/* 预览信息 */}
          {destination && departureDate && returnDate && preference && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-gray-900">旅行预览</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>📍 目的地: {destination}</div>
                <div>📅 时间: {departureDate} 至 {returnDate}</div>
                <div>⏰ 出发: {departureTime || '09:00'} | 返回: {returnTime || '18:00'}</div>
                <div>🎯 偏好: {preferenceOptions.find(p => p.id === preference)?.label}</div>
                <div>📊 行程: {calculateDuration(departureDate, returnDate)} 天</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}