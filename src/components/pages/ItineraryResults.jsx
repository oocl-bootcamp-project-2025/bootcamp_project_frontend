import preferenceOptionsValue from '@/common/preferenceOptionsValue';
import { saveItinerary } from '@/components/apis/api';
import itineraryTestData3 from '@/components/pages/testdata/ItineraryTestData3';
import { Calendar, ChevronLeft, Clock, MapPin, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AMapComponent from '../map/AMapComponent';
import ResultModal from '../modals/ResultModal';
import SaveItineraryModal from '../modals/SaveItineraryModal';
import { Button } from '../ui/button';
import './css/ItineraryOverviewCard.css';
import './css/ItineraryResults.css';
import './css/ItineraryStatistics.css';
import {useAuth} from "@/contexts/AuthContext";
import {message} from "antd";

function calculateDayDate(departureDate, dayIndex) {
  if (!departureDate) return "2025年9月22日"; // Fallback date

  // Parse the departure date
  const date = new Date(departureDate);
  // Add days based on the day index (0 for first day)
  date.setDate(date.getDate() + dayIndex);

  // Format the date as "YYYY年MM月DD日星期X"
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Get day of week in Chinese
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekDay = weekDays[date.getDay()];

  return `${year}年${month}月${day}日星期${weekDay}`;
}

export default function ItineraryResults({
  itineraryId,
  searchData,
  bookings = [],
  itinerary,
  routeData,
  onBack,
  onViewExpertArticle,
  onFindExperts,
  onReplaceAttraction,
  onResetItinerary,
  onUpdateItinerary
}) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);
  const panelRef = useRef(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState('success');
  const [resultMessage, setResultMessage] = useState('');
  const [bookingInfos, setBookingInfos] = useState({});

  // 初始化行程数据 - 使用 testdata2 的 itinerary 部分
  const [currentItinerary, setCurrentItinerary] = useState(itinerary || itineraryTestData3.itinerary);


  const { isAuthenticated, getToken, getPhone } = useAuth(); // 🎯 获取认证状态



  routeData = routeData || itineraryTestData3.route;

  // 处理景点拖拽移动
  const handleAttractionMove = (draggedItem, targetItem) => {
    const { dayKey: sourceDayKey, index: sourceIndex } = draggedItem;
    const { dayKey: targetDayKey, index: targetIndex } = targetItem;

    const newItinerary = { ...currentItinerary };
    const [removed] = newItinerary[sourceDayKey].splice(sourceIndex, 1);
    newItinerary[targetDayKey].splice(targetIndex, 0, removed);

    // Recalculate arrival times after moving
    const updatedItinerary = calculateArrivalTimes(newItinerary);
    setCurrentItinerary(updatedItinerary);
    onUpdateItinerary && onUpdateItinerary(updatedItinerary);
  };

  // 处理景点替换
  // const handleReplaceAttraction = (attractionId) => {
  //   onReplaceAttraction && onReplaceAttraction(attractionId, {
  //     id: 'new-attraction',
  //     name: '新景点',
  //     description: '替换后的景点',
  //     duration: '2小时',
  //     location: '新位置'
  //   });
  // };
  const handleReplaceAttraction = (attractionId) => {
    let updatedItinerary = { ...currentItinerary };
    let found = false;

    Object.keys(updatedItinerary).forEach(dayKey => {
      if (found) {
        return;
      }
      const index = updatedItinerary[dayKey].findIndex(attr => attr.id === attractionId);
      if (index !== -1) {
        updatedItinerary[dayKey][index] = {
          id: 'new-attraction',
          name: '新景点',
          description: '替换后的景点',
          duration: '2小时',
          location: '新位置'
        };
        found = true;
      }
    });
    if (found) {
      // Recalculate arrival times after replacement
      updatedItinerary = calculateArrivalTimes(updatedItinerary);
      setCurrentItinerary(updatedItinerary);
      onUpdateItinerary && onUpdateItinerary(updatedItinerary);
    }
    onReplaceAttraction && onReplaceAttraction(attractionId, {
      id: 'new-attraction',
      name: '新景点',
      description: '替换后的景点',
      duration: '2小时',
      location: '新位置'
    });
  };

  // 辅助函数：根据偏好生成描述
  const generatePreferenceDescription = () => {
    if (!searchData?.preference || !Array.isArray(searchData.preference) || searchData.preference.length === 0) {
      return `为您精心规划的${searchData?.days || 3}天深度游`;
    }

    // 根据偏好ID匹配对应的标签
    const preferenceLabels = searchData.preference
      .map(prefId => {
        const option = preferenceOptionsValue.find(opt => opt.id === prefId);
        return option ? option.label : null;
      })
      .filter(label => label !== null); // 过滤掉未找到的偏好

    if (preferenceLabels.length === 0) {
      return `为您精心规划的${searchData?.days || 3}天深度游`;
    }

    // 拼接偏好标签
    const preferenceText = preferenceLabels.join('、');
    return `${preferenceText}游`;
  };


  // add phone from auth context
  const phoneLogin = getPhone();

  // 新增：处理保存行程
  const handleSaveItinerary = async (phoneNumber) => {
    if (phoneNumber!== phoneLogin) {
      message.error('请使用登录时的手机号保存行程');
    }else
    {

      // test
      console.log('=== 保存行程 ===');
      console.log('用户手机号:', phoneNumber);
      console.log('================');

      // 参数校验
      if (!phoneNumber) {
        setResultType('error');
        setResultMessage('请输入有效的手机号');
        setShowResultModal(true);
        return;
      }
      const itineraryData = {
        title: (searchData.destination && searchData.duration) ? `${searchData.destination}${searchData.duration}天深度游` : '北京3天深度游',
        phoneNumber: phoneNumber,
        description: generatePreferenceDescription(),
        startDate: searchData?.departureDate || '',
        allNumber: getTotalAttractions(),
        itineraryData: JSON.stringify({ itinerary: currentItinerary })
      };
      await saveItinerary(itineraryData).then(response => {
        if (response.status !== 200) {
          throw new Error('保存失败');
        }
        setShowSaveModal(false);
        setResultType('success');
        setResultMessage('行程已成功保存！我们已将行程链接发送到您的手机，请注意查收短信。');
        setShowResultModal(true);
      }).catch(error => {
        setResultType('error');
        setResultMessage('保存失败，请检查网络连接后重试。如问题持续存在，请联系客服。');
        setShowResultModal(true);
      })
    }

  };
  // 处理触摸开始
  const handleTouchStart = (e) => {
    // 只在拖拽手柄上才开始拖拽，避免影响面板内容滚动
    if (!e.target.closest('.panel-handle')) return;

    setDragStart(e.touches[0].clientY);
    setIsDragging(true);
    setCurrentTranslateY(0); // 重置拖拽偏移
    // 只有在手柄上才阻止默认行为
    e.preventDefault();
  };

  // 处理触摸移动
  const handleTouchMove = (e) => {
    if (!isDragging || !dragStart) return;

    // 只有当拖拽确实开始（从手柄开始）时才阻止默认滚动行为
    e.preventDefault();
    e.stopPropagation();

    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStart; // 注意：这里是 currentY - dragStart，向下为正

    // 计算拖拽偏移（像素转百分比）
    const dragOffsetPercent = (diff / window.innerHeight) * 100;

    // 限制拖拽范围：向上最多拖拽30%，向下最多拖拽30%
    const limitedOffset = Math.max(-30, Math.min(30, dragOffsetPercent));

    setCurrentTranslateY(limitedOffset);
  };

  // 处理触摸结束
  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setDragStart(null);

    // 根据拖拽距离决定最终状态
    const threshold = 10; // 阈值：拖拽超过10%才切换状态

    if (currentTranslateY < -threshold) {
      // 向上拖拽超过阈值，展开面板
      setIsExpanded(true);
    } else if (currentTranslateY > threshold) {
      // 向下拖拽超过阈值，收起面板
      setIsExpanded(false);
    }
    // 其他情况保持当前状态不变

    // 重置拖拽偏移
    setCurrentTranslateY(0);
  };

  // 鼠标支持（桌面端）
  const handleMouseDown = (e) => {
    // 只在拖拽手柄上才开始拖拽，避免影响地图交互
    if (!e.target.closest('.panel-handle')) return;

    setDragStart(e.clientY);
    setIsDragging(true);
    setCurrentTranslateY(0); // 重置拖拽偏移
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;

    // 只在面板区域内阻止默认行为，不影响地图滚轮缩放
    if (e.target.closest('.itinerary-panel') || e.target.closest('.panel-handle')) {
      e.preventDefault();
      e.stopPropagation();
    }

    const currentY = e.clientY;
    const diff = currentY - dragStart; // 注意：这里是 currentY - dragStart，向下为正

    // 计算拖拽偏移（像素转百分比）
    const dragOffsetPercent = (diff / window.innerHeight) * 100;

    // 限制拖拽范围：向上最多拖拽30%，向下最多拖拽30%
    const limitedOffset = Math.max(-30, Math.min(30, dragOffsetPercent));
    setCurrentTranslateY(limitedOffset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setDragStart(null);

    // 根据拖拽距离决定最终状态
    const threshold = 10; // 阈值：拖拽超过10%才切换状态

    if (currentTranslateY < -threshold) {
      // 向上拖拽超过阈值，展开面板
      setIsExpanded(true);
    } else if (currentTranslateY > threshold) {
      // 向下拖拽超过阈值，收起面板
      setIsExpanded(false);
    }
    // 其他情况保持当前状态不变

    // 重置拖拽偏移
    setCurrentTranslateY(0);
  };

  // 添加全局鼠标和触摸事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart, isExpanded, currentTranslateY]);

  const days = Object.keys(currentItinerary);

  // 计算总览数据的辅助函数
  const getTotalAttractions = () => {
    return Object.values(currentItinerary).flat().length;
  };

  const getTotalDays = () => {
    return days.length;
  };

  const getVisitorCount = () => {
    return searchData?.travelers || 0;
  };

  // 辅助函数：格式化图片和时长
  function parseImages(images) {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    return images.split(',');
  }
  function formatDuration(duration) {
    if (typeof duration === 'number') return `${duration}小时`;
    if (typeof duration === 'string' && duration.match(/^\d+$/)) return `${duration}小时`;
    return duration || '2小时';
  }

  const parseHours = (duration) => {
    if (!duration) {
      return 2;
    }
    if (typeof duration === 'number') {
      return duration;
    }
    if (typeof duration === 'string') {
      if (duration.match(/^\d+$/)) {
        return parseInt(duration, 10);
      }
      const match = duration.match(/(\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 2
  }

  const addHoursToTime = (timeString, hours) => {
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    let minute = parseInt(minuteStr, 10) || 0;
    hour += Math.floor(hours);

    const fractionalHour = hours - Math.floor(hours);
    minute += Math.round(fractionalHour * 60);
    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute %= 60;
    }

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  const calculateArrivalTimes = (itinerary) => {
    // Deep clone
    const updatedItinerary = JSON.parse(JSON.stringify(itinerary));
    Object.keys(updatedItinerary).forEach(dayKey => {
      let currentTime = "09:00";
      updatedItinerary[dayKey] = updatedItinerary[dayKey].map((attraction, index) => {
        const updatedAttraction = { ...attraction, time: `${currentTime}-` };
        const hours = parseHours(attraction.duration);
        currentTime = addHoursToTime(currentTime, hours);

        return updatedAttraction;
      });
    });

    return updatedItinerary;
  }

  useEffect(() => {
    if (currentItinerary) {
      const updatedItinerary = calculateArrivalTimes(currentItinerary);
      setCurrentItinerary(updatedItinerary);
    }
  }, [currentItinerary]);

  // 构建Tabs的items数据
  const tabItems = [
    {
      key: 'overview',
      label: '总览',
      children: (
        <div className="overview-content">
          {/* 目的地卡片 */}
          <div className="destination-card">
            <h2>{searchData?.destination || '北京'}</h2>
            <p>为您精心规划的{getTotalDays()}天深度游</p>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{getTotalAttractions()}</div>
                <div className="stat-label">景点</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{getVisitorCount()}</div>
                <div className="stat-label">达人服务</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{getTotalDays()}</div>
                <div className="stat-label">天</div>
              </div>
            </div>
          </div>

          {/* 行程概览 */}
          <div className="itinerary-overview">
            <div className="section-header">
              <Calendar className="w-5 h-5" />
              <h3>行程概览</h3>
            </div>

            <div className="days-list">
              {days.map((dayKey, index) => {
                const dayNumber = index + 1;
                const attractions = currentItinerary[dayKey] || [];

                return (
                  <div key={dayKey} className="day-summary">
                    <div className="day-info">
                      <div className="day-label">第{dayNumber}天</div>
                      <div className="attraction-count">{attractions.length}个景点</div>
                    </div>

                    <div className="attractions-list">
                      {attractions.map((attraction, idx) => (
                        <div key={attraction.id || idx} className="attraction-overview-item">
                          {parseImages(attraction.images)[0] && (
                            <img src={parseImages(attraction.images)[0]} alt={attraction.name} className="attraction-thumb" />
                          )}
                          <div className="attraction-details">
                            <div className="attraction-name">{attraction.name}</div>
                            <div className="attraction-time-info">
                              <span className="arrival-time">{attraction.time?.split('-')[0] || '09:00'}</span>
                              <span className="duration">· {formatDuration(attraction.duration)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    ...days.map((dayKey, index) => ({
      key: dayKey,
      label: `第${index + 1}天`,
      children: (
        <div className="day-detail">
          <div className="day-header">
            <h3>第{index + 1}天</h3>
            <p>{(currentItinerary[dayKey] || []).length}个精选景点</p>
          </div>

          <div className="attractions-timeline">
            {(currentItinerary[dayKey] || []).map((attraction, attractionIndex) => (
              <div key={attraction.id || attractionIndex} className="attraction-item">
                <div className="time-dot">
                  <Clock className="w-4 h-4" />
                  <span>{attraction.time?.split('-')[0] || '09:00'}</span>
                  <small>({formatDuration(attraction.duration)})</small>
                </div>

                <div className="attraction-card">
                  {parseImages(attraction.images)[0] && (
                    <img src={parseImages(attraction.images)[0]} alt={attraction.name} />
                  )}

                  <div className="attraction-info">
                    <h4>{attraction.name}</h4>
                    <p>{attraction.description}</p>

                    {/* 添加预约信息提示框 */}
                    {bookings && bookings.some(booking =>
                      booking.attraction?.name === attraction.name || booking.attraction?.id === attraction.id
                    ) && (
                        <div className="booking-info-tag">
                          <Clock className="w-4 h-4" style={{ width: '20px' }} />
                          <div>
                            <p style={{ color: '#ff6b35', margin: 0 }}>已预约:</p>
                            <span>{bookings.find(b =>
                              b.attraction?.name === attraction.name ||
                              b.attraction?.id === attraction.id
                            )?.expert?.name}</span>
                            <span>{bookings.find(b =>
                              b.attraction?.name === attraction.name ||
                              b.attraction?.id === attraction.id
                            )?.service}</span>
                          </div>
                        </div>
                      )}

                    <div className="attraction-actions">
                      <button
                        className="action-btn primary width-auto"
                        onClick={() => {
                          // Find which day this attraction belongs to
                          const dayKey = Object.keys(currentItinerary).find(day =>
                            currentItinerary[day].some(attr =>
                              attr.id === attraction.id || attr.name === attraction.name
                            )
                          );

                          // Get the day index (0-based)
                          const dayIndex = days.indexOf(dayKey);

                          // Calculate the actual date for this day
                          const visitDate = calculateDayDate(searchData?.departureDate, dayIndex);

                          // Call onFindExperts with attraction and date info
                          onFindExperts && onFindExperts(attraction, visitDate);
                        }}
                      >
                        找达人
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/*/!* 添加更多景点 *!/*/}
            {/*<div className="add-attraction">*/}
            {/*  <Plus className="w-5 h-5" />*/}
            {/*  <span>添加更多景点</span>*/}
            {/*</div>*/}
          </div>
        </div>
      )
    }))
  ];

  return (
    <div className="itinerary-results-container">
      {/* 固定头部 */}
      <div className="itinerary-header">
        <div className="header-content">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="back-button"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="header-title">
            <h1>{searchData?.destination || '北京'}</h1>
            <p>{days.length}天行程 · {getTotalAttractions()}个景点</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveModal(true)}
            className="save-button"
          >
            保存
          </Button>
        </div>
      </div>

      {/* 地图底层 */}
      <div className="map-layer">
        <AMapComponent
          selectedTab={selectedTab}
          itinerary={currentItinerary}
          searchData={searchData}
          routeData={routeData}
        />

        {/* 我的位置按钮 */}
        {/*<button className="location-button">*/}
        {/*  <MapPin className="w-5 h-5" />*/}
        {/*  我的位置*/}
        {/*</button>*/}

        {/* 地图控制按钮 */}
        {/*<div className="map-controls">*/}
        {/*  <button className="map-control-btn">+</button>*/}
        {/*  <button className="map-control-btn">-</button>*/}
        {/*</div>*/}

        {/* 定位按钮 */}
        <button className="navigation-button">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12 2L13.09 7.26L18 6L16.74 11.09L22 12L16.74 12.91L18 18L12.91 16.74L12 22L11.09 16.74L6 18L7.26 12.91L2 12L7.26 11.09L6 6L11.09 7.26L12 2Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* 详细行程面板 */}
      <div
        ref={panelRef}
        className={`itinerary-panel ${isExpanded ? 'expanded' : 'collapsed'} ${isDragging ? 'dragging' : ''}`}
        style={isDragging ? {
          transform: isExpanded
            ? `translateY(calc(120px + ${currentTranslateY}%))`
            : `translateY(calc(100% - 160px + ${currentTranslateY}%))`
        } : undefined}
      >
        {/* 拖拽指示器 */}
        <div
          className="panel-handle"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="handle-bar"></div>
        </div>

        {/* 自定义标签页 */}
        <div className="panel-content">
          {/* 标签导航 */}
          <div className="custom-tab-nav">
            {tabItems.map((item) => (
              <button
                key={item.key}
                className={`custom-tab-button ${selectedTab === item.key ? 'active' : ''}`}
                onClick={() => setSelectedTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 标签内容 */}
          <div className="custom-tab-content">
            {tabItems.find(item => item.key === selectedTab)?.children}
          </div>
        </div>
      </div>

      {/* 新增：保存行程模态框 */}
      <SaveItineraryModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveItinerary}
      />

      {/* 新增：结果模态框 */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        type={resultType}
        message={resultMessage}
      />
    </div>
  );
}
