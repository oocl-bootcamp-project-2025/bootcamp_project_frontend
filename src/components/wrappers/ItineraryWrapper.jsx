import { Modal } from 'antd';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppProvider';
import ItineraryResults from '../pages/ItineraryResults';

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

  // 使用应用上下文
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
    setShouldShowServicesTab,
    setBookings,
    openArticleModal,
    openExpertList
  } = useAppContext();

  // 事件处理函数
  const handleBackToHome = useCallback(() => {
    // Show confirmation dialog before leaving
    Modal.confirm({
      title: '确定要离开行程规划页面吗？',
      content: '离开后将取消所有已预约的达人服务',
      okText: '狠心离开',
      cancelText: '继续规划',
      okButtonProps: {
        style: {
          background: '#ff6b35',
          borderColor: '#ff6b35',
        }
      },
      onOk: () => {
        // Clear all bookings
        setBookings([]);
        // Navigate back to home
        navigate('/home');
      }
    });
  }, [navigate, setBookings]);

  const handleViewExpertArticle = useCallback((expert, attractionName) => {
    setSelectedExpert(expert);
    setSelectedAttractionName(attractionName);
    openArticleModal();
  }, [setSelectedExpert, setSelectedAttractionName, openArticleModal]);


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
    setBookings(filteredBookings);

    console.log(`景点 ${oldAttractionId} 已替换为 ${newAttraction.name}，相关预约已清空`);
  }, [bookings, itinerary, updateItinerary, setBookings]);

  const handleResetItinerary = useCallback(() => {
    resetItinerary();
    // 也可以清空所有预约
    setBookings([]);
  }, [resetItinerary, setBookings]);

  return (
    <ItineraryResults
      searchData={searchData}
      bookings={bookings}
      itinerary={itinerary}
      onBack={handleBackToHome}
      onViewExpertArticle={handleViewExpertArticle}
      onFindExperts={handleFindExperts}
      onReplaceAttraction={handleReplaceAttraction}
      onResetItinerary={handleResetItinerary}
      onUpdateItinerary={updateItinerary}
    />
  );
}