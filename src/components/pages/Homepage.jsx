import { Alert, Button, Input } from 'antd';
import { Building, Calendar, Camera, ChevronDown, Coffee, Compass, MapPin, Mountain, Search, Users, UtensilsCrossed } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './css/Homepage.css';

// 导入常量和工具函数
import { CHINESE_CITIES, TIME_OPTIONS } from '../../constants';
import { calculateDuration, filterCities } from '../../utils';

export default function Homepage() {
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
    setTimeout(() => {
      setShowCityDropdown(false);
      // 只有选择了城市列表中的城市才有效，否则清空
      if (!CHINESE_CITIES.some(city => city.name === destination)) {
        setDestination('');
      }
    }, 200);
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

    if (!preference.length) {
      alert('请选择旅行偏好');
      return;
    }

    const searchData = {
      destination: destination.trim(),
      departureDate,
      departureTime: departureTime || '00:00',
      returnDate,
      returnTime: returnTime || '00:00',
      preference,
      duration: calculateDuration(departureDate, returnDate)
    };

    // 使用useNavigate进行路由跳转，传递搜索数据
    navigate('/itinerary', { state: { searchData } });
  };

  const getMaxReturnDate = () => {
    if (!departureDate) return '';
    const dep = new Date(departureDate);
    dep.setDate(dep.getDate() + 6);
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

  useEffect(() => {
    function handleClickOutside(event) {
      // 城市下拉
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
      // 出发时间
      if (
        departureTimeRef.current &&
        !departureTimeRef.current.contains(event.target)
      ) {
        setShowDepartureTime(false);
      }
      // 返回时间
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

  return (
    <div >
      <div className="p-8 text-center" style={{ marginTop: '20px' }}>
        <div className="space-y-2">
          <h1
            className="text-4xl font-bold mb-1"
            style={{
              background: 'linear-gradient(to bottom, #ff7518 0%, #ff9248 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              fontFamily: '"Ma Shan Zheng", "STKaiti", "KaiTi", cursive',
              letterSpacing: '0.05em',
              textShadow: 'none'
            }}
          >
            让AI为您规划
          </h1>
          <h1
            className="text-4xl font-bold"
            style={{
              background: 'linear-gradient(to bottom, #ff9248 0%, #ffb347 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              fontFamily: '"Ma Shan Zheng", "STKaiti", "KaiTi", cursive',
              letterSpacing: '0.05em',
              textShadow: 'none'
            }}
          >
            专属行程
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div >
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">

          <div className="relative" ref={cityDropdownRef}>
            <label className="flex items-center text-xl font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2" style={{ color: '#ff7518' }} />
              目的地
            </label>
            <div className="relative">
              <Input
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}

                placeholder="搜索城市名称或拼音"
                className="w-full"
                style={{
                  height: '40px',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '3px solid #ff7518';
                  e.target.style.boxShadow = '0 0 0 2px rgba(255, 117, 24, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.border = 'none';
                  e.target.style.boxShadow = 'none';
                  handleDestinationBlur();
                }}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>

            {/* 城市下拉选择 */}
            {showCityDropdown && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto ">
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
          <div className={'duration-card'}>
            <label className="flex items-center text-xl font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-500" style={{ color: '#ff7518' }} />
              旅行时间
            </label>
            <div className="grid grid-cols-2 gap-4" >
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  出发日期
                </label>
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  style={{ colorScheme: 'light', height: '40px' }}
                />

              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
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
                  返回日期
                </label>
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  style={{ colorScheme: 'light', height: '40px' }}
                  min={departureDate || undefined}
                  max={departureDate ? getMaxReturnDate() : undefined}
                  disabled={!canSelectReturnDate}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
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
                color: '#ff7518',
                fontWeight: 500,
                fontSize: 18,
                textAlign: 'center'
              }}
            />
          )}
          {/* 旅行偏好 */}

          <div className={'prefer-card'}>
            <label className="flex items-center text-xl font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4 mr-2 text-500" style={{ fontSize: '1.5rem', color: '#ff7518' }} />
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
            className={`w-full font-medium py-3 px-4 rounded-lg transition-all transform ${!destination.trim() || !departureDate || !returnDate || !preference.length
                ? 'bg-gray-300 cursor-not-allowed opacity-50'
                : 'hover:scale-105'
              }`}
            size="lg"
            disabled={!destination.trim() || !departureDate || !returnDate || !preference.length}
            style={{
              background: !destination.trim() || !departureDate || !returnDate || !preference.length
                ? '#E5E7EB'
                : 'linear-gradient(135deg, #ff7518 0%, #ffb347 100%)',
              color: !destination.trim() || !departureDate || !returnDate || !preference.length
                ? '#9CA3AF'
                : 'white',
              borderRadius: '12px'
            }}
          >
            <Search className="w-5 h-5 mr-2" />
            开始规划我的旅程
          </Button>

        </div>
      </div>
    </div>
  );
}
