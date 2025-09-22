import { ChevronLeft, MapPin, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import DraggableAttractionCard from '../common/DraggableAttractionCard';
import { Button } from '../ui/button';

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
  const [selectedDay, setSelectedDay] = useState('day1');
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

      {/* Day Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto">
          <div className="flex overflow-x-auto">
            {days.map((dayKey, index) => (
              <button
                key={dayKey}
                onClick={() => setSelectedDay(dayKey)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${selectedDay === dayKey
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                第 {index + 1} 天
                <span className="ml-1 text-xs text-gray-500">
                  ({currentItinerary[dayKey]?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="max-w-md mx-auto p-4">
        {currentItinerary[selectedDay] && currentItinerary[selectedDay].length > 0 ? (
          <div className="space-y-4">
            {currentItinerary[selectedDay].map((attraction, index) => (
              <DraggableAttractionCard
                key={attraction.id}
                attraction={attraction}
                index={index}
                dayKey={selectedDay}
                onMove={handleAttractionMove}
                onViewDetails={onViewAttractionDetails}
                onFindExperts={onFindExperts}
                onReplace={handleReplaceAttraction}
                bookings={bookings}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              当天暂无安排
            </h3>
            <p className="text-gray-600 mb-4">
              开始添加景点来规划这一天的行程
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              添加景点
            </Button>
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