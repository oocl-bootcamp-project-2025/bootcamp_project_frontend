import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Lazy load components to improve initial load time
const Homepage = lazy(() => import('./components/Homepage'));
const ItineraryResults = lazy(() => import('./components/ItineraryResults'));
const AttractionDetailPage = lazy(() => import('./components/AttractionDetailPage'));
const PostDetailPage = lazy(() => import('./components/PostDetailPage'));
const ExpertProfilePage = lazy(() => import('./components/ExpertProfilePage'));
const ExpertArticleModal = lazy(() => import('./components/ExpertArticleModal'));
const ServiceSelectionModal = lazy(() => import('./components/ServiceSelectionModal'));
const ExpertBookingModal = lazy(() => import('./components/ExpertBookingModal'));
const ExpertListModal = lazy(() => import('./components/ExpertListModal'));

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchData, setSearchData] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedAttractionName, setSelectedAttractionName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isExpertListOpen, setIsExpertListOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [shouldShowServicesTab, setShouldShowServicesTab] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const handleStartPlanning = useCallback((data) => {
    setSearchData(data);
    setCurrentPage('results');
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentPage('home');
  }, []);

  const handleViewExpertArticle = useCallback((expert, attractionName) => {
    setSelectedExpert(expert);
    setSelectedAttractionName(attractionName);
    setIsArticleModalOpen(true);
  }, []);

  const handleCloseArticleModal = useCallback(() => {
    setIsArticleModalOpen(false);
    setSelectedExpert(null);
    setSelectedAttractionName('');
  }, []);

  const handleBookServicesFromArticle = useCallback((expert) => {
    setSelectedExpert(expert);
    setIsArticleModalOpen(false);
    setIsServiceSelectionOpen(true);
  }, []);

  const handleServiceSelected = useCallback((expert, serviceId) => {
    setSelectedExpert(expert);
    setSelectedServiceId(serviceId);
    setIsServiceSelectionOpen(false);
    setIsBookingModalOpen(true);
  }, []);

  const handleCloseServiceSelection = useCallback(() => {
    setIsServiceSelectionOpen(false);
    setSelectedExpert(null);
  }, []);

  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
    setSelectedExpert(null);
    setSelectedServiceId(null);
  }, []);

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

    // 添加景点信息到预约数据
    const bookingWithAttraction = {
      ...booking,
      attraction: selectedAttraction ? {
        id: selectedAttraction.id || selectedAttraction.name,
        name: selectedAttraction.name
      } : undefined
    };

    setBookings(prev => [...prev, bookingWithAttraction]);
    setIsBookingModalOpen(false);
    setSelectedServiceId(null);
    // 预约成功后回到达人详情页的服务项目tab
    setCurrentPage('expert-profile');
    setShouldShowServicesTab(true);
  }, [selectedAttraction, bookings]);

  // New handlers for page navigation
  const handleViewAttractionDetails = useCallback((attraction) => {
    setSelectedAttraction(attraction);
    setCurrentPage('attraction-detail');
  }, []);

  const handleBackFromAttractionDetail = useCallback(() => {
    setCurrentPage('results');
    setSelectedAttraction(null);
  }, []);

  const handleFindExperts = useCallback((attraction) => {
    setSelectedAttraction(attraction);
    setIsExpertListOpen(true);
  }, []);

  const handleCloseExpertList = useCallback(() => {
    setIsExpertListOpen(false);
    setSelectedAttraction(null);
  }, []);

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
    setIsExpertListOpen(false);
    setShouldShowServicesTab(false); // 从列表进入不自动跳转到services tab
    setCurrentPage('expert-profile');
  }, []);

  const handleBackFromExpertProfile = useCallback(() => {
    // If we came from attraction detail, go back there, otherwise go to results
    setCurrentPage('results');
    setSelectedExpert(null);
    setShouldShowServicesTab(false);
  }, []);

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
    setIsBookingModalOpen(true);
  }, [selectedAttraction, bookings]);

  const handleCancelBooking = useCallback((expertId, serviceId) => {
    const attractionId = selectedAttraction?.id || selectedAttraction?.name;
    setBookings(prev => prev.filter(booking => 
      !(booking.expert.id === expertId && 
        booking.service === serviceId && 
        (booking.attraction?.id === attractionId || booking.attraction?.name === attractionId))
    ));
  }, [selectedAttraction]);

  const additionalImages = useMemo(() => [
    'https://images.unsplash.com/photo-1622034094192-60e76098c96d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5c2NhcGUlMjB1cmJhbiUyMHRyYXZlbHxlbnwxfHx8fDE3NTgzNzk0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1737735356104-ef0037705756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwYXJjaGl0ZWN0dXJlJTIwdGVtcGxlJTIwY3VsdHVyZXxlbnwxfHx8fDE3NTg0NDUyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1599486503843-c9a5e92d18ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBjaGluZXNlfGVufDF8fHx8MTc1ODM3OTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ], []);

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
    setCurrentPage('post-detail');
  }, [additionalImages]);

  const handleViewReview = useCallback((review) => {
    const post = {
      type: 'review',
      author: {
        name: review.userName,
        avatar: review.userAvatar
      },
      date: review.date,
      content: review.content,
      images: review.images || ['https://images.unsplash.com/photo-1737735356104-ef0037705756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwYXJjaGl0ZWN0dXJlJTIwdGVtcGxlJTIwY3VsdHVyZXxlbnwxfHx8fDE3NTg0NDUyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral']
    };
    setSelectedPost(post);
    setCurrentPage('post-detail');
  }, []);

  const handleBackFromPostDetail = useCallback(() => {
    if (selectedPost?.type === 'review') {
      setCurrentPage('attraction-detail');
    } else {
      setCurrentPage('expert-profile');
    }
    setSelectedPost(null);
  }, [selectedPost]);

  // 景点替换功能
  const handleReplaceAttraction = useCallback((oldAttractionId, newAttraction) => {
    if (!oldAttractionId || !newAttraction) return;
    
    // 清空被替换景点的所有预约
    setBookings(prev => prev.filter(booking => {
      const attractionId = booking.attraction?.id || booking.attraction?.name;
      return attractionId !== oldAttractionId;
    }));

    // 更新行程中的景点
    setItinerary(prev => {
      if (!prev) return prev;
      
      const updated = { ...prev };
      Object.keys(updated).forEach(dayKey => {
        if (updated[dayKey]) {
          const attractionIndex = updated[dayKey].findIndex((a) => a.id === oldAttractionId);
          if (attractionIndex !== -1) {
            // 保持原有时间和位置信息，只替换景点内容
            updated[dayKey][attractionIndex] = {
              ...updated[dayKey][attractionIndex],
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
      return updated;
    });
  }, []);

  // 重置行程功能  
  const handleResetItinerary = useCallback(() => {
    const confirmed = window.confirm('确定要重置整个行程吗？这将清空所有预约和自定义修改。');
    if (confirmed) {
      setItinerary(null);
      setBookings([]);
      // 显示成功提示
      setTimeout(() => {
        alert('行程已重置成功！');
      }, 100);
    }
  }, []);

  const generateArticleContent = useCallback((article) => {
    // Generate more detailed content based on the article
    const contents = {
      '天安门的日出与历史印记': `每一个日出都见证着历史的变迁，在这里感受时间的流逝和文化的传承。

作为一名土生土长的北京人，我有幸见证了天安门广场在不同时代的变迁。每当黎明时分，当第一缕阳光洒向这片古老而神圣的土地时，我总能感受到历史的厚重和文化的传承。

天安门广场的日出有着独特的魅力。清晨5点半，当城市还在沉睡中时，我已经站在了广场的最佳观景位置。随着东方天际逐渐泛白，远山如黛，近水如镜，整个广场在晨光中显得格外庄严肃穆。

这里不仅仅是一个观看日出的地方，更是一个承载着历史记忆的文化象征。从明朝的皇城大门，到今天的人民广场，每一寸土地都诉说着中华民族的历史变迁。

建议大家一定要早起来感受这份独特的震撼，那种历史与现代交融的感觉，会让你对这座城市有全新的认识。`,
      
      '摄影师眼中的天安门四季': `春夏秋冬，每个季节的天安门都有不同的美，让我带你发现这些美丽。

作为一名摄影师，我用镜头记录了天安门广场四季的变化，每个季节都有其独特的美丽和魅力。

春天的天安门，万物复苏。广场周围的柳絮飞舞，给庄严的建筑增添了一份柔���。最佳拍摄时间是清晨和傍晚，柔和的光线让整个广场显得温暖而有活力。

夏日的天安门，绿意盎然。蓝天白云下的红墙黄瓦格外醒目，这时候可以拍到色彩对比强烈的作品。建议使用偏振镜来突出天空的层次感。

秋季的天安门，金桂飘香。周围的银杏叶黄了，为庄重的广场增添了温暖的色调。这是我最喜欢的拍摄季节，金黄色的叶子与红色的宫墙形成完美的色彩搭配。

冬日的天安门，雪花纷飞。雪后的广场别有一番韵味，白雪覆盖下的建筑显得更加纯净��神圣。雪景拍摄要注意曝光补偿，避免画面过暗。

每个季节都有最佳的拍摄时机和技巧，希望能帮助更多摄影爱好者记录下这座城市的美好瞬间。`,
      
      '天安门广场的隐秘角落': `作为本地人，我知道一些游客不知道的拍照好位置和有趣的小细节。

在天安门广场这样一个知名景点，大多数游客都会去那些标志性的位置拍照。但作为一个在这里生活了30多年的老北京，我想和大家分享一些隐藏的拍摄角度和有趣的细节。

首先是观景台的最佳位置。很多人不知道，在广场东南角有一个略微高起的平台，从这里可以拍到整个广场的全景，而且人流相对较少。特别是在傍晚时分，夕阳西下的时候，从这个角度拍摄的照片特别有层次感。

其次是建筑细节的发现。天安门城楼上的每一个细节都有其历史意义，比如那些精美的彩绘、雕刻，都值得用镜头记录下来。我经常用长焦镜头来拍摄这些细节，展现古代工匠的精湛技艺。

还有一些有趣的人文瞬间。清晨时分，会有很多大爷大妈在广场上晨练，他们的身影与古老的建筑形成了有趣的对比。这些生活化的场景往往能拍出很有故事性的照片。

最后想说的是，拍摄不仅仅是记录美景，更重要的是感受这里的历史和文化。每一次按下快门，都是在记录一个时代的印记。`
    };
    
    return contents[article.title] || article.preview + '\n\n这里有更多精彩内容等待发现...';
  }, []);

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
            {currentPage === 'home' && (
              <Homepage 
                onStartPlanning={handleStartPlanning}
              />
            )}
            
            {currentPage === 'results' && (
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
                onUpdateItinerary={setItinerary}
              />
            )}

            {currentPage === 'attraction-detail' && (
              <AttractionDetailPage
                attraction={selectedAttraction}
                onBack={handleBackFromAttractionDetail}
                onViewReview={handleViewReview}
              />
            )}

            {currentPage === 'expert-profile' && (
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

            {currentPage === 'post-detail' && (
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