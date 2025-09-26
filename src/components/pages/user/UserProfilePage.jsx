import LoadingModal from '@/components/modals/LoadingModal';
import ResultModal from '@/components/modals/ResultModal';
import { Button, Card, Spin, Tabs, message } from 'antd';
import { ArrowLeft, Book, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // 🎯 添加认证上下文
import { fetchItineraries, getItineraryDataByItineraryId, getPlanningRouteByAttractions } from '../../apis/api.js';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, getToken, getPhone, logout } = useAuth(); // 🎯 添加getPhone方法
  const [activeTab, setActiveTab] = useState('itineraries');
  const [userItineraries, setUserItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState('error');
  const [resultMessage, setResultMessage] = useState('');

  // 获取用户行程数据
  const fetchUserItineraries = async () => {
    try {
      setLoading(true);
      setError(null);

      // 从AuthContext获取用户电话号码
      const phoneNumber = getPhone();
      if (!phoneNumber) {
        throw new Error('用户未登录或电话号码不存在');
      }

      // 使用api.js中的fetchItineraries函数
      const itinerariesData = await fetchItineraries(phoneNumber);

      // 添加调试信息
      console.log('后端返回的行程数据:', itinerariesData);

      // 确保返回的是数组格式
      if (Array.isArray(itinerariesData)) {
        setUserItineraries(itinerariesData);
      } else {
        setUserItineraries([]);
      }

    } catch (error) {
      console.error('获取用户行程数据失败:', error);
      setError(error);
      message.error('获取行程数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取用户行程数据
  useEffect(() => {
    // 🎯 使用AuthContext检查认证状态
    console.log('UserProfilePage: 检查认证状态');
    console.log('isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('UserProfilePage: 用户未登录，跳转到登录页面');
      navigate('/login?redirect=%2Fuser%2Fprofile');
      return;
    }

    console.log('UserProfilePage: 用户已登录，获取用户数据');
    fetchUserItineraries();
  }, [navigate, isAuthenticated]); // 🎯 依赖isAuthenticated而不是手动检查localStorage

  // 重试函数
  const handleRetry = () => {
    fetchUserItineraries();
  };

  const getAttractions = (itineraryData) => {
    if (!itineraryData) return [];
    // 按day1、day2...顺序排序
    const dayKeys = Object.keys(itineraryData)
      .filter(key => key.startsWith('day'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('day', ''), 10);
        const numB = parseInt(b.replace('day', ''), 10);
        return numA - numB;
      });

    const attractions = [];
    dayKeys.forEach(dayKey => {
      const dayAttractions = itineraryData[dayKey];
      if (Array.isArray(dayAttractions)) {
        dayAttractions.forEach(attraction => {
          if (attraction && attraction.name) {
            attractions.push(attraction);
          }
        });
      }
    });
    return attractions;
  }

  const handleTabClick = async (id, createdTime) => {
    try {
      setShowLoadingModal(true);
      const itineraryData = await getItineraryDataByItineraryId(id);
      console.log('获取的行程详情数据:', itineraryData);
      const attractions = getAttractions(itineraryData.data.itinerary);
      const days = Object.keys(itineraryData.data.itinerary).length;
      const departureDate = createdTime;
      const destination = attractions[0]?.area;
      console.log('行程包含的景点:', attractions);
      console.log('行程天数:', days);
      console.log('出发日期:', departureDate);
      console.log('目的地:', destination);
      const itineraryAllData = await getPlanningRouteByAttractions(attractions, days);
      const {itinerary, route} = itineraryAllData.data;
      setShowLoadingModal(false);
      if (!itinerary || !route) {
        setResultType('error');
        setResultMessage('AI行程规划失败，请稍后重试');
        setShowResultModal(true);
        return;
      }
      const searchData = {
        destination,
        departureDate,
        duration:days
      };
      navigate(`/itinerary/${id}`, { state: { searchData, itinerary, routeData: route }});
    }catch (error) {
      setShowLoadingModal(false);
      setResultType('error');
      setResultMessage('AI行程规划失败，请检查网络或稍后重试');
      setShowResultModal(true);
      console.error('AI规划接口异常:', err);
    }
  };

  return (
      <div className="min-h-screen max-h-screen overflow-hidden flex flex-col" style={{ height: '844px', background: '#f8f9fa' }}>
        {/* 头部导航 - 使用Homepage风格 */}
        <header className="flex-shrink-0 px-4 py-3" style={{ background: '#f8f9fa' }}>
          <div className="flex items-center justify-between">
            <Button
                type="text"
                icon={<ArrowLeft className="w-5 h-5" style={{ color: '#ff7518' }} />}
                onClick={() => navigate('/')}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-orange-50 transition-colors"
                style={{ border: 'none', boxShadow: 'none' }}
            />
            <h1
                className="text-2xl font-bold"
                style={{
                  background: 'linear-gradient(to bottom, #ff7518 0%, #ff9248 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: '"Ma Shan Zheng", "STKaiti", "KaiTi", cursive',
                  letterSpacing: '0.05em'
                }}
            >
              我的
            </h1>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-orange to-brand-yellow flex items-center justify-center">
              <span className="text-white text-sm font-[Alex_Brush]">Sito</span>
            </div>
          </div>
        </header>

        {/* 内容选项卡 */}
        <div className="flex-1 px-4 pb-4 overflow-hidden">
          <div className="h-full overflow-hidden">
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                centered
                className="h-full no-ink-bar" /* 添加 no-ink-bar 类 */
                tabBarStyle={{
                  borderBottom: 'none',
                  margin: '0 16px',
                  background: 'transparent'
                }}
                tabBarGutter={30}
                animated={false}
                inkBarStyle={{ display: 'none' }}
                items={[
                  {
                    key: 'itineraries',
                    label: (
                        <span className="flex items-center text-base font-medium">
                    <Book className="w-4 h-4 mr-2" style={{ color: activeTab === 'itineraries' ? '#ff7518' : '#666' }} />
                    <span style={activeTab === 'itineraries' ? {
                      background: 'linear-gradient(to bottom, #ff7518 0%, #ff9248 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      fontWeight: 'bold'
                    } : { color: '#666' }}>
                      我的行程
                    </span>
                  </span>
                    ),
                    children: (
                        <div className="h-full overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                          {loading ? (
                              <div className="flex flex-col items-center justify-center py-20">
                                <Spin size="large" style={{ color: '#ff7518' }} />
                                <div className="mt-4 text-gray-600 text-base">加载行程数据中...</div>
                              </div>
                          ) : error ? (
                              <div className="flex flex-col items-center justify-center py-20">
                                <div className="mb-4 text-red-500 text-base">获取行程数据失败</div>
                                <Button
                                    onClick={handleRetry}
                                    className="font-medium"
                                    style={{
                                      background: 'linear-gradient(135deg, #ff7518 0%, #ffb347 100%)',
                                      color: 'white',
                                      borderRadius: '8px',
                                      border: 'none'
                                    }}
                                >
                                  重试
                                </Button>
                              </div>
                          ) : userItineraries.length > 0 ? (
                              <div className="space-y-3">
                                {userItineraries.map((itinerary, index) => {

                                  const destinationName = itinerary.title;

                                  const attractionCount = itinerary.allNumber;

                                  const createdTime = itinerary.startDate;

                                  return (
                                      <Card
                                          key={itinerary.id || index}
                                          className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                                          onClick={()=> handleTabClick(itinerary.id, createdTime)}
                                          style={{
                                            borderRadius: '12px',
                                            border: '1px solid #f0f0f0',
                                            boxShadow: '0 2px 8px rgba(255, 117, 24, 0.1)'
                                          }}
                                          hoverable
                                      >
                                        <div className="p-2">
                                          <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                              {destinationName}
                                            </h3>
                                            <div
                                                className="px-2 py-1 rounded-full text-xs font-medium"
                                                style={{
                                                  background: 'linear-gradient(135deg, #ff7518 0%, #ffb347 100%)',
                                                  color: 'white'
                                                }}
                                            >
                                              行程
                                            </div>
                                          </div>

                                          <div className="flex items-center text-gray-600 mb-2">
                                            <MapPin className="w-4 h-4 mr-2" style={{ color: '#ff7518' }} />
                                            <span className="text-sm">{attractionCount}个景点</span>
                                          </div>

                                          <div className="flex items-center text-gray-500">
                                            <Clock className="w-4 h-4 mr-2" style={{ color: '#ff9248' }} />
                                            <span className="text-sm">创建于 {createdTime}</span>
                                          </div>
                                        </div>
                                      </Card>
                                  );
                                })}
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center py-20">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ background: 'linear-gradient(135deg, #ff7518 0%, #ffb347 100%)' }}
                                >
                                  <span className="text-2xl">📝</span>
                                </div>
                                <div className="text-gray-600 text-base mb-4">您还没有创建任何行程</div>
                                <Button
                                    onClick={() => navigate('/')}
                                    className="font-medium"
                                    size="large"
                                    style={{
                                      background: 'linear-gradient(135deg, #ff7518 0%, #ffb347 100%)',
                                      color: 'white',
                                      borderRadius: '8px',
                                      border: 'none',
                                      padding: '0 24px'
                                    }}
                                >
                                  开始规划行程
                                </Button>
                              </div>
                          )}
                        </div>
                    ),
                  },
                ]}
            />
          </div>
        </div>
        {/* 新增：AI智能规划等待弹窗 */}
        <LoadingModal
          isOpen={showLoadingModal}
          onClose={() => setShowLoadingModal(false)}
          message="正在复刻路线"
          message3="预计需要30秒左右，请耐心等待复刻路线"
        />
        <ResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          type={resultType}
          message={resultMessage}
        />
        
        {/* 登出链接 */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          paddingBottom: '20px',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '20px'
        }}>
          <button
            onClick={() => {
              // 使用AuthContext的logout方法，登出后跳转到首页
              logout('/');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#666';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#999';
            }}
          >
            登出账户
          </button>
        </div>
      </div>
  );
}
