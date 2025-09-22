import { useCallback, useState } from 'react';
import { PAGES } from '../constants';

// 应用状态管理Hook
export const useAppState = () => {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const [searchData, setSearchData] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedAttractionName, setSelectedAttractionName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [shouldShowServicesTab, setShouldShowServicesTab] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  // 页面导航
  const navigateToPage = useCallback((page, data = {}) => {
    setCurrentPage(page);

    // 根据页面设置相关数据
    if (data.searchData) setSearchData(data.searchData);
    if (data.selectedExpert) setSelectedExpert(data.selectedExpert);
    if (data.selectedAttraction) setSelectedAttraction(data.selectedAttraction);
    if (data.selectedPost) setSelectedPost(data.selectedPost);
    if (data.selectedAttractionName) setSelectedAttractionName(data.selectedAttractionName);
    if (data.selectedServiceId) setSelectedServiceId(data.selectedServiceId);
    if (data.shouldShowServicesTab !== undefined) setShouldShowServicesTab(data.shouldShowServicesTab);
  }, []);

  // 添加预约
  const addBooking = useCallback((booking) => {
    setBookings(prev => [...prev, booking]);
  }, []);

  // 取消预约
  const cancelBooking = useCallback((expertId, serviceId, attractionId) => {
    setBookings(prev => prev.filter(booking =>
      !(booking.expert.id === expertId &&
        booking.service === serviceId &&
        (booking.attraction?.id === attractionId || booking.attraction?.name === attractionId))
    ));
  }, []);

  // 更新行程
  const updateItinerary = useCallback((newItinerary) => {
    setItinerary(newItinerary);
  }, []);

  // 重置行程和预约
  const resetItinerary = useCallback(() => {
    setItinerary(null);
    setBookings([]);
  }, []);

  return {
    // 状态
    currentPage,
    searchData,
    selectedExpert,
    selectedAttractionName,
    selectedServiceId,
    selectedAttraction,
    selectedPost,
    bookings,
    shouldShowServicesTab,
    itinerary,

    // 方法
    navigateToPage,
    addBooking,
    cancelBooking,
    updateItinerary,
    resetItinerary,

    // 直接设置器（用于特殊情况）
    setCurrentPage,
    setSearchData,
    setSelectedExpert,
    setSelectedAttractionName,
    setSelectedServiceId,
    setSelectedAttraction,
    setSelectedPost,
    setBookings,
    setShouldShowServicesTab,
    setItinerary
  };
};