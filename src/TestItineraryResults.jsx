import ItineraryResults from './components/pages/ItineraryResults';

// 测试数据
const mockSearchData = {
  destination: '北京',
  travelers: 2,
  duration: 3
};

const mockItinerary = {
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
  ]
};

export default function TestItineraryResults() {
  const handleBack = () => {
    console.log('返回');
  };

  const handleFindExperts = (attraction) => {
    console.log('查找专家:', attraction);
  };

  const handleReplaceAttraction = (attractionId, newAttraction) => {
    console.log('替换景点:', attractionId, newAttraction);
  };

  const handleResetItinerary = () => {
    console.log('重置行程');
  };

  const handleUpdateItinerary = (newItinerary) => {
    console.log('更新行程:', newItinerary);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ItineraryResults
        searchData={mockSearchData}
        bookings={[]}
        itinerary={mockItinerary}
        onBack={handleBack}
        onFindExperts={handleFindExperts}
        onReplaceAttraction={handleReplaceAttraction}
        onResetItinerary={handleResetItinerary}
        onUpdateItinerary={handleUpdateItinerary}
      />
    </div>
  );
}