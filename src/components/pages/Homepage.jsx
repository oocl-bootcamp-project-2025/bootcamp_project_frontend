import { Alert, Button } from 'antd';
import { Building, Calendar, Camera, ChevronDown, Clock, Coffee, Compass, Heart, MapPin, Mountain, Search, Users, UtensilsCrossed } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';

// 导入常量和工具函数
import { CHINESE_CITIES, TIME_OPTIONS } from '../../constants';
import { calculateDuration, filterCities } from '../../utils';

export default function Homepage({ onStartPlanning }) {
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('00:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('00:00');
  const [showDepartureTime, setShowDepartureTime] = useState(false);
  const [showReturnTime, setShowReturnTime] = useState(false);
  const [preference, setPreference] = useState([]);
  const departureTimeRef = useRef(null);
  const returnTimeRef = useRef(null);
  const cityDropdownRef = useRef(null);

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
      const filtered = filterCities(CHINESE_CITIES, value);
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

  const handleDestinationBlur = () => {
    // 只有选择了城市列表中的城市才有效，否则清空
    if (!CHINESE_CITIES.some(city => city.name === destination)) {
      setDestination('');
    }
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

    // 使用React Router导航到行程页面，并传递搜索数据
    navigate('/itinerary', { state: { searchData } });

    // 如果还需要调用原有的回调（向后兼容）
    if (onStartPlanning) {
      onStartPlanning(searchData);
    }
  };

  const getMaxReturnDate = () => {
    if (!departureDate) return '';
    const dep = new Date(departureDate);
    dep.setDate(dep.getDate() + 7);
    return dep.toISOString().split('T')[0];
  };

  const canSelectReturnDate = !!departureDate;

  const handlePreferenceClick = (id) => {
    if (preference.includes(id)) {
      setPreference(preference.filter((p) => p !== id));
    } else if (preference.length < 3) {
      setPreference([...preference, id]);
    }
  };

  const duration = departureDate && returnDate
    ? calculateDuration(departureDate, returnDate)
    : null;

  // 点击外部收起时间选择器
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        departureTimeRef.current &&
        !departureTimeRef.current.contains(event.target)
      ) {
        setShowDepartureTime(false);
      }
      if (
        returnTimeRef.current &&
        !returnTimeRef.current.contains(event.target)
      ) {
        setShowReturnTime(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="relative" ref={cityDropdownRef}>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              目的地
            </label>
            <div className="relative">
              <Input
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onBlur={handleDestinationBlur}
                placeholder="搜索城市名称或拼音"
                className="w-full"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* 城市下拉选择 */}
            {showCityDropdown && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto " style={{ width: '350px' }}>
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    onMouseDown={() => handleCitySelect(city.name)}
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
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ colorScheme: 'light' }}
              />

            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                出发时间
              </label>
              <div className="relative" ref={departureTimeRef}>
                <button
                  onClick={() => setShowDepartureTime(!showDepartureTime)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between"
                >
                  {departureTime || '0:00'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showDepartureTime && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                    {TIME_OPTIONS.map((time) => (
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
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ colorScheme: 'light' }}
                min={departureDate || undefined}
                max={departureDate ? getMaxReturnDate() : undefined}
                disabled={!canSelectReturnDate}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                返回时间
              </label>
              <div className="relative" ref={returnTimeRef}>
                <button
                  onClick={() => setShowReturnTime(!showReturnTime)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between"
                >
                  {returnTime || '0:00'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showReturnTime && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto"  >
                    {TIME_OPTIONS.map((time) => (
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

          {departureDate && returnDate && (
            <Alert
              message={`行程共 ${duration} 天`}
              type="info"
              showIcon={false}
              style={{
                margin: 16,
                background: 'linear-gradient(90deg,#fff7ed 0%,#f0f9ff 100%)',
                border: 'none',
                color: '#d97706',
                fontWeight: 500,
                fontSize: 18,
                textAlign: 'center',
                padding: '18px 0'
              }}
            />
          )}
          {/* 旅行偏好 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4 mr-2 text-pink-500" />
              旅行偏好
            </label>
            <div className="grid grid-cols-2 gap-3">
              {preferenceOptions.map((option) => {
                const IconComponent = option.icon;
                const selected = preference.includes(option.id);
                const disabled = !selected && preference.length >= 3;
                return (
                  <button
                    key={option.id}
                    onClick={() => handlePreferenceClick(option.id)}
                    className={`p-3 rounded-lg border transition-all ${selected
                      ? `${option.color} border-current`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={disabled}
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

        </div>
      </div>
    </div>
  );
}

