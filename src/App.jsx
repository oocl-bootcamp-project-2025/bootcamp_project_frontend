import { lazy, Suspense, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Hooks
import { useAppState, useModalState } from './hooks';

// Constants
import { PAGES } from './constants';

// Utils
import { DEFAULT_ADDITIONAL_IMAGES, generateArticleContent } from './utils/mockData';

// Lazy load components to improve initial load time
const Homepage = lazy(() => import('./components/pages/Homepage'));
const ItineraryResults = lazy(() => import('./components/pages/ItineraryResults'));
const AttractionDetailPage = lazy(() => import('./components/pages/AttractionDetailPage'));
const PostDetailPage = lazy(() => import('./components/pages/PostDetailPage'));
const ExpertProfilePage = lazy(() => import('./components/pages/ExpertProfilePage'));
const ExpertArticleModal = lazy(() => import('./components/modals/ExpertArticleModal'));
const ServiceSelectionModal = lazy(() => import('./components/modals/ServiceSelectionModal'));
const ExpertBookingModal = lazy(() => import('./components/modals/ExpertBookingModal'));
const ExpertListModal = lazy(() => import('./components/modals/ExpertListModal'));

export default function App() {
  // 使用自定义hooks管理状态
  const appState = useAppState();
  const modalState = useModalState();

  const {
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
    navigateToPage,
    addBooking,
    cancelBooking,
    updateItinerary,
    resetItinerary,
    setSelectedExpert,
    setSelectedAttractionName,
    setSelectedServiceId,
    setSelectedAttraction,
    setSelectedPost,
    setShouldShowServicesTab,
    setBookings
  } = appState;

  const {
    isArticleModalOpen,
    isServiceSelectionOpen,
    isBookingModalOpen,
    isExpertListOpen,
    openArticleModal,
    closeArticleModal,
    openServiceSelection,
    closeServiceSelection,
    openBookingModal,
    closeBookingModal,
    openExpertList,
    closeExpertList
  } = modalState;

  // 事件处理函数
  const handleStartPlanning = useCallback((data) => {
    navigateToPage(PAGES.RESULTS, { searchData: data });
  }, [navigateToPage]);

  const handleBackToHome = useCallback(() => {
    navigateToPage(PAGES.HOME);
  }, [navigateToPage]);

  const handleViewExpertArticle = useCallback((expert, attractionName) => {
    setSelectedExpert(expert);
    setSelectedAttractionName(attractionName);
    openArticleModal();
  }, [setSelectedExpert, setSelectedAttractionName, openArticleModal]);

  const handleCloseArticleModal = useCallback(() => {
    closeArticleModal();
    setSelectedExpert(null);
    setSelectedAttractionName('');
  }, [closeArticleModal, setSelectedExpert, setSelectedAttractionName]);

  const handleBookServicesFromArticle = useCallback((expert) => {
    setSelectedExpert(expert);
    closeArticleModal();
    openServiceSelection();
  }, [setSelectedExpert, closeArticleModal, openServiceSelection]);

  const handleServiceSelected = useCallback((expert, serviceId) => {
    setSelectedExpert(expert);
    setSelectedServiceId(serviceId);
    closeServiceSelection();
    openBookingModal();
  }, [setSelectedExpert, setSelectedServiceId, closeServiceSelection, openBookingModal]);

  const handleCloseServiceSelection = useCallback(() => {
    closeServiceSelection();
    setSelectedExpert(null);
    setSelectedServiceId(null);
  }, [closeServiceSelection, setSelectedExpert, setSelectedServiceId]);

  const handleCloseBookingModal = useCallback(() => {
    closeBookingModal();
    setSelectedExpert(null);
    setSelectedServiceId(null);
  }, [closeBookingModal, setSelectedExpert, setSelectedServiceId]);

  const handleConfirmBooking = useCallback((booking) => {
    // 检查该景点是否已经预约了其他达人
    const attractionId = selectedAttraction?.id || selectedAttraction?.name;
    const existingBooking = bookings.find(b =>
      (b.attraction?.id === attractionId || b.attraction?.name === attractionId) &&
      b.expert.id !== booking.expert.id
    );

    if (existingBooking) {
      alert(`该景点已预约达人"${existingBooking.expert.name}"，一个景点只能预约一个达人。请先取消之前的预约或选择其他景点。`);
      return;
    }

    addBooking(booking);
    closeBookingModal();
    setSelectedServiceId(null);
    // 预约成功后回到达人详情页的服务项目tab
    navigateToPage(PAGES.EXPERT_PROFILE);
    setShouldShowServicesTab(true);
  }, [selectedAttraction, bookings, addBooking, closeBookingModal, setSelectedServiceId, navigateToPage, setShouldShowServicesTab]);

  // 页面导航处理函数
  const handleViewAttractionDetails = useCallback((attraction) => {
    navigateToPage(PAGES.ATTRACTION_DETAIL, { selectedAttraction: attraction });
  }, [navigateToPage]);

  const handleBackFromAttractionDetail = useCallback(() => {
    navigateToPage(PAGES.RESULTS);
    setSelectedAttraction(null);
  }, [navigateToPage, setSelectedAttraction]);

  const handleFindExperts = useCallback((attraction) => {
    setSelectedAttraction(attraction);
    openExpertList();
  }, [setSelectedAttraction, openExpertList]);

  const handleCloseExpertList = useCallback(() => {
    closeExpertList();
    setSelectedAttraction(null);
  }, [closeExpertList, setSelectedAttraction]);

  const handleSelectExpertFromList = useCallback((expert) => {
    // Ensure expert has all required fields
    const enrichedExpert = {
      ...expert,
      verified: expert.verified !== false,
      responseTime: expert.responseTime || '1小时内',
      priceRange: expert.priceRange || '¥200-500/天',
      articlesCount: expert.articlesCount || 20,
      location: expert.location || '北京市',
      followers: expert.followers || 500
    };
    setSelectedExpert(enrichedExpert);
    closeExpertList();
    setShouldShowServicesTab(false);
    navigateToPage(PAGES.EXPERT_PROFILE);
  }, [setSelectedExpert, closeExpertList, setShouldShowServicesTab, navigateToPage]);

  const handleBackFromExpertProfile = useCallback(() => {
    navigateToPage(PAGES.RESULTS);
    setSelectedExpert(null);
    setShouldShowServicesTab(false);
  }, [navigateToPage, setSelectedExpert, setShouldShowServicesTab]);

  const handleBookServiceFromProfile = useCallback((expert, serviceId) => {
    // 检查该景点是否已经预约了其他达人
    const attractionId = selectedAttraction?.id || selectedAttraction?.name;
    const existingBooking = bookings.find(b =>
      (b.attraction?.id === attractionId || b.attraction?.name === attractionId) &&
      b.expert.id !== expert.id
    );

    if (existingBooking) {
      alert(`该景点已预约达人"${existingBooking.expert.name}"，一个景点只能预约一个达人。请先取消之前的预约或选择其他景点。`);
      return;
    }

    setSelectedExpert(expert);
    setSelectedServiceId(serviceId);
    openBookingModal();
  }, [selectedAttraction, bookings, setSelectedExpert, setSelectedServiceId, openBookingModal]);

  const handleCancelBooking = useCallback((expertId, serviceId) => {
    const attractionId = selectedAttraction?.id || selectedAttraction?.name;
    cancelBooking(expertId, serviceId, attractionId);
  }, [selectedAttraction, cancelBooking]);

  const additionalImages = useMemo(() => DEFAULT_ADDITIONAL_IMAGES, []);

  const handleViewArticleFromProfile = useCallback((expert, article) => {
    const post = {
      type: 'article',
      author: {
        name: expert.name,
        avatar: expert.avatar
      },
      date: article.publishDate,
      title: article.title,
      content: generateArticleContent(article),
      images: [article.image, ...additionalImages]
    };
    setSelectedPost(post);
    navigateToPage(PAGES.POST_DETAIL);
  }, [additionalImages, setSelectedPost, navigateToPage]);

  const handleViewReview = useCallback((review) => {
    const post = {
      type: 'review',
      author: {
        name: review.userName,
        avatar: review.userAvatar
      },
      date: review.date,
      content: review.content,
      images: review.images || [DEFAULT_ADDITIONAL_IMAGES[1]]
    };
    setSelectedPost(post);
    navigateToPage(PAGES.POST_DETAIL);
  }, [setSelectedPost, navigateToPage]);

  const handleBackFromPostDetail = useCallback(() => {
    if (selectedPost?.type === 'review') {
      navigateToPage(PAGES.ATTRACTION_DETAIL);
    } else {
      navigateToPage(PAGES.EXPERT_PROFILE);
    }
    setSelectedPost(null);
  }, [selectedPost, navigateToPage, setSelectedPost]);

  // 景点替换功能
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
            id: newAttraction.id,
            name: newAttraction.name,
            duration: newAttraction.duration,
            description: newAttraction.description,
            detailedDescription: newAttraction.detailedDescription,
            images: newAttraction.images,
            // 重置专家列表
            experts: []
          };
        }
      }
    });

    updateItinerary(updatedItinerary);
    setBookings(filteredBookings);
  }, [bookings, itinerary, updateItinerary, setBookings]);

  // 重置行程功能  
  const handleResetItinerary = useCallback(() => {
    const confirmed = window.confirm('确定要重置整个行程吗？这将清空所有预约和自定义修改。');
    if (confirmed) {
      resetItinerary();
      // 显示成功提示
      setTimeout(() => {
        alert('行程已重置成功！');
      }, 100);
    }
  }, [resetItinerary]);

  // Loading component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Mobile App Container */}
      <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
        {/* Mobile Safe Area */}
        <div className="min-h-screen max-w-md mx-auto bg-white relative shadow-xl">
          <Suspense fallback={<LoadingSpinner />}>
            {/* Page Routing */}
            {currentPage === PAGES.HOME && (
              <Homepage
                onStartPlanning={handleStartPlanning}
              />
            )}

            {currentPage === PAGES.RESULTS && (
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
            )}

            {currentPage === PAGES.ATTRACTION_DETAIL && (
              <AttractionDetailPage
                attraction={selectedAttraction}
                onBack={handleBackFromAttractionDetail}
                onViewReview={handleViewReview}
              />
            )}

            {currentPage === PAGES.EXPERT_PROFILE && (
              <ExpertProfilePage
                expert={selectedExpert}
                onBack={handleBackFromExpertProfile}
                onBookService={handleBookServiceFromProfile}
                onViewArticle={handleViewArticleFromProfile}
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                selectedAttraction={selectedAttraction}
                shouldShowServicesTab={shouldShowServicesTab}
              />
            )}

            {currentPage === PAGES.POST_DETAIL && (
              <PostDetailPage
                onBack={handleBackFromPostDetail}
                post={selectedPost}
              />
            )}

            {/* Mobile Modals */}
            {isArticleModalOpen && (
              <ExpertArticleModal
                expert={selectedExpert}
                attractionName={selectedAttractionName}
                isOpen={isArticleModalOpen}
                onClose={handleCloseArticleModal}
                onBookServices={handleBookServicesFromArticle}
              />
            )}

            {isServiceSelectionOpen && (
              <ServiceSelectionModal
                expert={selectedExpert}
                isOpen={isServiceSelectionOpen}
                onClose={handleCloseServiceSelection}
                onServiceSelected={handleServiceSelected}
              />
            )}

            {isBookingModalOpen && (
              <ExpertBookingModal
                expert={selectedExpert}
                selectedServiceId={selectedServiceId}
                isOpen={isBookingModalOpen}
                onClose={handleCloseBookingModal}
                onConfirmBooking={handleConfirmBooking}
              />
            )}

            {isExpertListOpen && (
              <ExpertListModal
                attraction={selectedAttraction}
                isOpen={isExpertListOpen}
                onClose={handleCloseExpertList}
                onSelectExpert={handleSelectExpertFromList}
                bookings={bookings}
              />
            )}
          </Suspense>
        </div>
      </div>
    </DndProvider>
  );
}