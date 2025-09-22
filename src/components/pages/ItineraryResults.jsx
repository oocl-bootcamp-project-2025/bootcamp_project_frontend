import { Calendar, ChevronLeft, Clock, MapPin, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import DraggableAttractionCard from '../common/DraggableAttractionCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export default function ItineraryResults({
  searchData,
  bookings = [],
  itinerary,
  onBack,
  onViewExpertArticle,
  onViewAttractionDetails,
  onFindExperts,
  onReplaceAttraction,
  onResetItinerary,
  onUpdateItinerary
}) {
  const [selectedTab, setSelectedTab] = useState('overview'); // 默认显示总览
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 初始化行程数据
  const [currentItinerary, setCurrentItinerary] = useState(itinerary || {
    day1: [
      {
        id: 'attraction1',
        name: '天安门广场',
        description: '中华人民共和国首都北京市的城市广场，位于北京市中心',
        duration: '2小时',
        time: '09:00-11:00',
        location: '东城区',
        images: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500'],
        experts: []
      },
      {
        id: 'attraction2',
        name: '故宫博物院',
        description: '明清两朝的皇家宫殿，现为综合性博物馆',
        duration: '3小时',
        time: '13:00-16:00',
        location: '东城区',
        images: ['https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500'],
        experts: []
      }
    ],
    day2: [
      {
        id: 'attraction3',
        name: '长城',
        description: '中国古代的军事防御工程',
        duration: '4小时',
        time: '09:00-13:00',
        location: '延庆区',
        images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500'],
        experts: []
      }
    ],
    day3: [
      {
        id: 'attraction4',
        name: '颐和园',
        description: '中国清朝时期皇家园林',
        duration: '3小时',
        time: '10:00-13:00',
        location: '海淀区',
        images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500'],
        experts: []
      },
      {
        id: 'attraction3',
        name: '长城',
        description: '中国古代的军事防御工程',
        duration: '4小时',
        time: '09:00-13:00',
        location: '延庆区',
        images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500'],
        experts: []
      }
    ]
  });

  // 处理景点拖拽移动
  const handleAttractionMove = (draggedItem, targetItem) => {
    const { dayKey: sourceDayKey, index: sourceIndex } = draggedItem;
    const { dayKey: targetDayKey, index: targetIndex } = targetItem;

    const newItinerary = { ...currentItinerary };

    // 从源位置移除
    const [removed] = newItinerary[sourceDayKey].splice(sourceIndex, 1);

    // 插入到目标位置
    newItinerary[targetDayKey].splice(targetIndex, 0, removed);

    setCurrentItinerary(newItinerary);
    onUpdateItinerary && onUpdateItinerary(newItinerary);
  };

  // 处理景点替换
  const handleReplaceAttraction = (attractionId) => {
    onReplaceAttraction && onReplaceAttraction(attractionId, {
      id: 'new-attraction',
      name: '新景点',
      description: '替换后的景点',
      duration: '2小时',
      location: '新位置'
    });
  };

  // 处理行程重置
  const handleResetItinerary = () => {
    if (onResetItinerary) {
      onResetItinerary();
      setCurrentItinerary({});
    }
    setShowResetConfirm(false);
  };

  const days = Object.keys(currentItinerary);

  // 计算总览数据
  const getTotalAttractions = () => {
    return Object.values(currentItinerary).flat().length;
  };

  const getTotalDays = () => {
    return days.length;
  };

  const getVisitorCount = () => {
    return searchData?.travelers || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="mr-2 p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {searchData?.destination || '目的地'} 行程
                </h1>
                <p className="text-sm text-gray-600">
                  {days.length} 天行程规划
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white border-b sticky top-[73px] z-30">
        <div className="max-w-md mx-auto px-4">
          <div className="flex overflow-x-auto">
            {/* 总览标签 */}
            <button
              onClick={() => setSelectedTab('overview')}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'overview'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              总览
            </button>
            
            {/* 天数标签 */}
            {days.map((dayKey, index) => (
              <button
                key={dayKey}
                onClick={() => setSelectedTab(dayKey)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === dayKey
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                第{index + 1}天
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-md mx-auto px-4 py-4">
        {selectedTab === 'overview' ? (
          // 总览视图
          <div>
            {/* 总览卡片 */}
            <Card className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white border-0 shadow-lg mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{searchData?.destination || '北京'}</h2>
                </div>
                
                <p className="text-white/90 mb-6 text-sm">
                  为您精心规划的{getTotalDays()}天旅程
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">{getTotalAttractions()}</div>
                    <div className="text-white/80 text-sm">景点</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">{getVisitorCount()}</div>
                    <div className="text-white/80 text-sm">出行人数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">{getTotalDays()}</div>
                    <div className="text-white/80 text-sm">天</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 行程概览列表 */}
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 mr-2 text-orange-500" />
              <h3 className="text-lg font-semibold">行程概览</h3>
            </div>

            <div className="space-y-3">
              {days.map((dayKey, index) => {
                const dayNumber = index + 1;
                const attractions = currentItinerary[dayKey] || [];
                const dayName = `第${dayNumber}天`;
                
                return (
                  <Card key={dayKey} className="p-4 bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-orange-600 font-semibold text-sm">{dayNumber}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{dayName}</h4>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {attractions.length} 个景点
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {attractions.slice(0, 2).map((attraction) => (
                        <div key={attraction.id} className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={attraction.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100'} 
                              alt={attraction.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm truncate">{attraction.name}</h5>
                            <p className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {attraction.time} • {attraction.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                      {attractions.length > 2 && (
                        <div className="text-center">
                          <span className="text-sm text-gray-400">还有 {attractions.length - 2} 个景点...</span>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          // 单日详细视图
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                第{days.indexOf(selectedTab) + 1}天详细行程
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                重新规划
              </Button>
            </div>

            {/* 单日景点列表 */}
            <div className="space-y-4">
              {(currentItinerary[selectedTab] || []).map((attraction, index) => (
                <DraggableAttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  index={index}
                  dayKey={selectedTab}
                  onMove={handleAttractionMove}
                  onViewDetails={() => onViewAttractionDetails && onViewAttractionDetails(attraction)}
                  onFindExperts={() => onFindExperts && onFindExperts(attraction)}
                  onReplace={() => handleReplaceAttraction(attraction.id)}
                  bookings={bookings}
                />
              ))}

              {/* 添加更多景点按钮 */}
              <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-orange-300 transition-colors">
                <button
                  className="w-full flex items-center justify-center text-gray-500 hover:text-orange-500"
                  onClick={() => {/* 添加景点逻辑 */}}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  添加更多景点
                </button>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">重置行程</h3>
            <p className="text-gray-600 mb-4">
              确定要重置整个行程吗？这将清空所有预约和自定义修改。
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResetConfirm(false)}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleResetItinerary}
              >
                确认重置
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              行程总览: {days.length} 天，
              共 {Object.values(currentItinerary).reduce((total, day) => total + day.length, 0)} 个景点
            </p>
            <p className="text-xs text-gray-500">
              专家预约: {bookings.length} 个服务
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}