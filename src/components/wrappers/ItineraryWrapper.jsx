import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ItineraryResults from '../pages/ItineraryResults';
import { useAppState, useModalState } from '../../hooks';
import { PAGES } from '../../constants';

export default function ItineraryWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从路由state中获取搜索数据，或使用默认数据
  const searchData = location.state?.searchData || {
    destination: '北京',
    departureDate: '2024-03-15',
    returnDate: '2024-03-17',
    preference: 'culture'
  };

  // 使用应用状态
  const appState = useAppState();
  const modalState = useModalState();

  const {
    selectedExpert,
    selectedAttractionName,
    selectedServiceId,
    selectedAttraction,
    bookings,
    itinerary,
    navigateToPage,
    addBooking,
    updateItinerary,
    resetItinerary,
    setSelectedExpert,
    setSelectedAttractionName,
    setSelectedServiceId,
    setSelectedAttraction,
    setShouldShowServicesTab
  } = appState;

  const {
    openArticleModal,
    openExpertList
  } = modalState;

  // 事件处理函数
  const handleBackToHome = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const handleViewExpertArticle = useCallback((expert, attractionName) => {
    setSelectedExpert(expert);
    setSelectedAttractionName(attractionName);
    openArticleModal();
  }, [setSelectedExpert, setSelectedAttractionName, openArticleModal]);

  const handleViewAttractionDetails = useCallback((attraction) => {
    // 可以导航到景点详情页面
    navigate('/attraction-detail', { state: { attraction } });
  }, [navigate]);

  const handleFindExperts = useCallback((attraction) => {
    setSelectedAttraction(attraction);
    openExpertList();
  }, [setSelectedAttraction, openExpertList]);

  const handleReplaceAttraction = useCallback((oldAttractionId, newAttraction) => {
    if (!oldAttractionId || !newAttraction) return;

    // 清空被替换景点的所有预约
    const filteredBookings = bookings.filter(booking => {
      const attractionId = booking.attraction?.id || booking.attraction?.name;
      return attractionId !== oldAttractionId;
    });

    // 更新行程中的景点
    const updatedItinerary = { ...itinerary };
    Object.keys(updatedItinerary).forEach(dayKey => {
      if (updatedItinerary[dayKey]) {
        const attractionIndex = updatedItinerary[dayKey].findIndex((a) => a.id === oldAttractionId);
        if (attractionIndex !== -1) {
          // 保持原有时间和位置信息，只替换景点内容
          updatedItinerary[dayKey][attractionIndex] = {
            ...updatedItinerary[dayKey][attractionIndex],
            ...newAttraction
          };
        }
      }
    });

    updateItinerary(updatedItinerary);
    // 更新预约列表
    appState.setBookings(filteredBookings);
    
    console.log(`景点 ${oldAttractionId} 已替换为 ${newAttraction.name}，相关预约已清空`);
  }, [bookings, itinerary, updateItinerary, appState]);

  const handleResetItinerary = useCallback(() => {
    resetItinerary();
    // 也可以清空所有预约
    appState.setBookings([]);
  }, [resetItinerary, appState]);

  return (
    <ItineraryResults
      searchData={searchData}
      bookings={bookings}
      itinerary={itinerary}
      onBack={handleBackToHome}
      onViewExpertArticle={handleViewExpertArticle}
      onViewAttractionDetails={handleViewAttractionDetails}
      onFindExperts={handleFindExperts}
      onReplaceAttraction={handleReplaceAttraction}
      onResetItinerary={handleResetItinerary}
      onUpdateItinerary={updateItinerary}
    />
  );
}