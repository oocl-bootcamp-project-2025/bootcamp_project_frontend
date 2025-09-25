import { Alert, Button, Input } from 'antd';
import { Calendar, ChevronDown, MapPin, Search, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingModal from '../modals/LoadingModal';
import ResultModal from '../modals/ResultModal';
import './css/Homepage.css';

// 导入常量和工具函数
import preferenceOptionsValue from '@/common/preferenceOptionsValue';
import { TIME_OPTIONS } from '../../constants';
import { calculateDuration } from '../../utils';
import { getAIPlanningRoute, getCities } from '../apis/api';

export default function Homepage() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState('');
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('00:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('00:00');
  const [showDepartureTime, setShowDepartureTime] = useState(false);
  const [showReturnTime, setShowReturnTime] = useState(false);
  const [preference, setPreference] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState('error');
  const [resultMessage, setResultMessage] = useState('');
  const departureTimeRef = useRef(null);
  const returnTimeRef = useRef(null);
  const cityDropdownRef = useRef(null);

  const preferenceOptions = preferenceOptionsValue;

  const fetchCities = async () => {
    setLoading(true);
    try {
      // API返回数据
      const response = await getCities();
      const formattedCities = response.data.map(city => ({
        name: city[0],  // First element is the city name
        province: city[1] // Second element is the province
      }));
      setCities(formattedCities);
      console.log('获取城市数据成功:', formattedCities);
    } catch (error) {
      console.error('获取城市数据失败:', error);
      // 设置一些默认城市数据作为备选
      setCities([
        { name: '北京', province: '北京市' },
        { name: '上海', province: '上海市' },
        { name: '广州', province: '广东省' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 在组件挂载时获取城市数据
  useEffect(() => {
    fetchCities();
  }, []);

  //城市过滤逻辑
  const filterCities = (cityList, query) => {
    if (!query || query.trim() === '') return [];
    const searchTerm = query.toLowerCase();
    return cityList.filter(city =>
      city.name.toLowerCase().includes(searchTerm) ||
      city.province.toLowerCase().includes(searchTerm)
    );
  };

  // 处理目的地输入
  const handleDestinationChange = (value) => {
    setDestination(value);
    if (value.length > 0) {
      const filtered = filterCities(cities, value);
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
      if (!cities.some(city => city.name === destination)) {
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

  const handleStartPlanning = async () => {
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
    console.log('搜索参数:', searchData);
    setShowLoadingModal(true);
    try {
      const response = await getAIPlanningRoute(searchData);
      console.log('homepage response:', response);
      const itinerary = response.data?.itinerary || null;
      const route = response.data?.route || null;
      setShowLoadingModal(false);
      if (!itinerary || !route) {
        setResultType('error');
        setResultMessage('AI行程规划失败，请稍后重试');
        setShowResultModal(true);
        return;
      }
      navigate('/itinerary', { state: { searchData, itinerary, routeData: route } });
    } catch (err) {
      setShowLoadingModal(false);
      setResultType('error');
      setResultMessage('AI行程规划失败，请检查网络或稍后重试');
      setShowResultModal(true);
      console.error('AI规划接口异常:', err);
    }
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
    <div className="min-h-screen max-h-screen overflow-hidden flex flex-col" style={{ height: '844px' }}>
      {/* 移动到最顶部的移动端头部 */}
      <header className="mobile-header flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-orange to-brand-yellow flex items-center justify-center">
            <span className="text-white  text-sm font-[Alex_Brush]">Sito</span>
          </div>
          <div className="flex items-center h-7">
            <span className="text-gray-900 text-lg font-bold font-[Alex_Brush]" style={{ marginBottom: '-5px' }}>私途</span>
            <span className="text-gray-900 text-lg font-[Alex_Brush] ml-1" style={{ marginBottom: '-5px' }}>Sito</span>
          </div>
        </div>
        <button
          onClick={() => {
            // 如果onGoToMyPage函数不存在，则定义一个默认行为
            const goToMyPage = window.onGoToMyPage || (() => navigate('/my-page'));
            goToMyPage();
          }}
          className="btn-mobile-icon bg-gradient-to-r from-brand-orange to-brand-yellow text-white shadow-sm hover:shadow-md"
        >
          <Users className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 标题部分 - 减少padding和margin */}
        <div className="p-4 text-center flex-shrink-0">
          <div className="space-y-1">
            <h1
              className="text-3xl font-bold mb-1"
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
              让Sito为您规划
            </h1>
            <h1
              className="text-3xl font-bold"
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

        {/* Main Content - 使用flex-1自动填充剩余空间 */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 space-y-4 h-full">

            <div className="relative" ref={cityDropdownRef}>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" style={{ color: '#ff7518' }} />
                目的地
              </label>
              <div className="relative">
                <Input
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}

                  placeholder={loading ? "加载城市中..." : "搜索城市名称或省份"}
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
                    if (destination.trim()) {
                      // 如果输入框有值，尝试再次过滤和显示下拉框
                      const filtered = filterCities(cities, destination);
                      if (filtered.length > 0) {
                        setFilteredCities(filtered);
                        setShowCityDropdown(true);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.border = 'none';
                    e.target.style.boxShadow = 'none';
                    handleDestinationBlur();
                  }}
                />
                {loading ? (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                )}
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

            {/* 出发时间 - 减小padding和间距 */}
            <div className="duration-card" style={{ padding: '8px' }}>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-500" style={{ color: '#ff7518' }} />
                旅行时间
              </label>
              <div className="grid grid-cols-2 gap-3" >
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    出发日期
                  </label>
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{ colorScheme: 'light', height: '36px' }}
                  />

                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    出发时间
                  </label>
                  <div className="relative" ref={departureTimeRef}>
                    <button
                      onClick={() => setShowDepartureTime(!showDepartureTime)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between"
                      style={{ height: '36px' }}
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
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    返回日期
                  </label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{ colorScheme: 'light', height: '36px' }}
                    min={departureDate || undefined}
                    max={departureDate ? getMaxReturnDate() : undefined}
                    disabled={!canSelectReturnDate}
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    返回时间
                  </label>
                  <div className="relative" ref={returnTimeRef}>
                    <button
                      onClick={() => setShowReturnTime(!showReturnTime)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-orange-500 focus:border-transparent flex items-center justify-between"
                      style={{ height: '36px' }}
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
                  margin: '8px 0',
                  background: 'linear-gradient(90deg,#fff7ed 0%,#f0f9ff 100%)',
                  border: 'none',
                  color: '#ff7518',
                  fontWeight: 500,
                  fontSize: 16,
                  textAlign: 'center'
                }}
              />
            )}

            {/* 旅行偏好 - 减小padding和间距 */}
            <div className="prefer-card" style={{ padding: '8px' }}>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-2 text-500" style={{ fontSize: '1.2rem', color: '#ff7518' }} />
                旅行偏好
              </label>
              <div className="grid grid-cols-2 gap-2">
                {preferenceOptions.map((option) => {
                  const IconComponent = option.icon;
                  const selected = preference.includes(option.id);
                  const disabled = !selected && preference.length >= 3;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePreferenceClick(option.id)}
                      className={`p-2 rounded-lg border transition-all ${selected
                        ? `${option.color} border-current`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={disabled}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 开始规划按钮 */}
            <Button
              onClick={handleStartPlanning}
              className={`w-full font-medium py-2 px-4 rounded-lg transition-all transform ${!destination.trim() || !departureDate || !returnDate || !preference.length
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
                borderRadius: '12px',
                height: '40px'
              }}
            >
              <Search className="w-4 h-4 mr-2" />
              开始规划我的旅程
            </Button>

          </div>
        </div>
      </div>

      {/* 新增：AI智能规划等待弹窗 */}
      <LoadingModal
        isOpen={showLoadingModal}
        onClose={() => setShowLoadingModal(false)}
      />
      {/* 新增：AI规划失败弹窗 */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        type={resultType}
        message={resultMessage}
      />
    </div>
  );
}
