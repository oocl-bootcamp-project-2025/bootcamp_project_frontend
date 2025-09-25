import { Button, Card, Spin, Tabs, message } from 'antd';
import { ArrowLeft, Book, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItineraries } from '../../apis/api.js';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('itineraries');
  const [userItineraries, setUserItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取用户行程数据
  const fetchUserItineraries = async () => {
    try {
      setLoading(true);
      setError(null);

      // 从localStorage获取用户电话号码
      const phoneNumber = localStorage.getItem('last_login_phone');
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
    // 检查是否有登录信息
    const phoneNumber = localStorage.getItem('last_login_phone');
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (!phoneNumber || !token) {
      // 没有登录信息，跳转到登录页面
      navigate('/login?redirect=%2Fuser%2Fprofile');
      return;
    }

    fetchUserItineraries();
  }, [navigate]);

  // 重试函数
  const handleRetry = () => {
    fetchUserItineraries();
  };

  return (
    <div className="user-profile-page">
      {/* 头部导航 */}
      <header className="profile-header">
        <Button
          type="text"
          icon={<ArrowLeft />}
          onClick={() => navigate('/')}
          className="back-button"
        />
        <div className="header-title" style={{ flex: 1, marginLeft: '120px' }}>我的</div>

      </header>

      {/* 内容选项卡 */}
      <div className="profile-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'itineraries',
              label: (
                <span className="tab-label">
                  <Book className="tab-icon" />
                  我的行程
                </span>
              ),
              children: (
                <div className="itineraries-list">
                  {loading ? (
                    <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
                      <Spin size="large" />
                      <div style={{ marginTop: '16px', color: '#666' }}>加载行程数据中...</div>
                    </div>
                  ) : error ? (
                    <div className="error-state" style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ marginBottom: '16px', color: '#ff4d4f' }}>获取行程数据失败</div>
                      <Button onClick={handleRetry} type="primary">
                        重试
                      </Button>
                    </div>
                  ) : userItineraries.length > 0 ? (
                    userItineraries.map((itinerary, index) => {

                      const destinationName = itinerary.title;

                      const attractionCount = itinerary.allNumber ;

                      const createdTime = itinerary.startDate;

                      return (
                        <Card
                          key={itinerary.id || index}
                          className="itinerary-card"
                          onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                        >
                          <div className="itinerary-info">
                            <div className="itinerary-destination">
                              {destinationName}
                            </div>
                            <div className="itinerary-meta">
                              <span>
                                <MapPin className="meta-icon" />
                                {attractionCount}个景点
                              </span>
                            </div>
                            <div className="itinerary-date">
                              <Clock className="meta-icon" />
                              创建于 {createdTime}
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <div className="empty-text">您还没有创建任何行程</div>
                      <Button
                        type="primary"
                        onClick={() => navigate('/')}
                        className="empty-action"
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
  );
}
