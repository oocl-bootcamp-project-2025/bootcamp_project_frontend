import { BarChartOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, LeftOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Modal, Row, Space, Statistic, Tabs, Typography } from 'antd';
import { useState } from 'react';
import CollapsibleMap from '../common/CollapsibleMap';
import DraggableAttractionCard from '../common/DraggableAttractionCard';
import './css/ItineraryResults.css';

const { Title, Text } = Typography;

export default function ItineraryResults({
  searchData,
  bookings = [],
  itinerary,
  onBack,
  onViewExpertArticle,

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

  // 处理景点移动
  const handleAttractionMove = (dragIndex, hoverIndex, dayKey) => {
    const dayAttractions = [...(currentItinerary[dayKey] || [])];
    const dragItem = dayAttractions[dragIndex];
    dayAttractions.splice(dragIndex, 1);
    dayAttractions.splice(hoverIndex, 0, dragItem);

    const updatedItinerary = {
      ...currentItinerary,
      [dayKey]: dayAttractions
    };

    setCurrentItinerary(updatedItinerary);
    onUpdateItinerary && onUpdateItinerary(updatedItinerary);
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
                type="text"
                size="large"
                onClick={onBack}
                icon={<LeftOutlined />}
                className="mr-2"
              />
              <div>
                <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                  {searchData?.destination || '目的地'} 行程
                </Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {days.length} 天行程规划
                </Text>
              </div>
            </div>

            <Button
              type="default"
              size="small"
              onClick={() => setShowResetConfirm(true)}
              icon={<RedoOutlined />}
            >
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 可折叠地图 */}
      <div className="max-w-md mx-auto px-4 py-4">
        <CollapsibleMap
          searchData={searchData}
          itinerary={currentItinerary}
        />
      </div>

      {/* Ant Design Tabs */}
      <div className="max-w-md mx-auto">
        <Tabs
          activeKey={selectedTab}
          onChange={setSelectedTab}
          type="card"
          className="bg-white"
          items={[
            {
              key: 'overview',
              label: '总览',
              children: (
                <div className="px-4 py-4">
                  {/* 总览卡片 */}
                  <Card
                    style={{
                      background: 'linear-gradient(to right, #fb923c, #fbbf24)',
                      border: 'none',
                      color: 'white',
                      marginBottom: '24px'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Title level={3} style={{ color: 'white', margin: 0 }}>
                        {searchData?.destination || '北京'}
                      </Title>
                    </div>

                    <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '24px' }}>
                      为您精心规划的{getTotalDays()}天旅程
                    </Text>

                    <Row gutter={16}>
                      <Col span={8}>
                        <div className="text-center">
                          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {getTotalAttractions()}
                          </div>
                          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>景点</Text>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-center">
                          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {getVisitorCount()}
                          </div>
                          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>出行人数</Text>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-center">
                          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {getTotalDays()}
                          </div>
                          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>天</Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  {/* 行程概览列表 */}
                  <div className="flex items-center mb-4">
                    <CalendarOutlined style={{ color: '#f97316', marginRight: '8px', fontSize: '20px' }} />
                    <Title level={4} style={{ margin: 0 }}>行程概览</Title>
                  </div>

                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {days.map((dayKey, index) => {
                      const dayNumber = index + 1;
                      const attractions = currentItinerary[dayKey] || [];
                      const dayName = `第${dayNumber}天`;

                      return (
                        <Card key={dayKey} size="small">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Avatar
                                size="large"
                                style={{ backgroundColor: '#fed7aa', color: '#ea580c', marginRight: '12px' }}
                              >
                                {dayNumber}
                              </Avatar>
                              <div>
                                <Title level={5} style={{ margin: 0 }}>{dayName}</Title>
                                <Text type="secondary">
                                  <EnvironmentOutlined style={{ marginRight: '4px' }} />
                                  {attractions.length} 个景点
                                </Text>
                              </div>
                            </div>
                          </div>

                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {attractions.slice(0, 2).map((attraction) => (
                              <div key={attraction.id} className="flex items-center">
                                <Avatar
                                  size="large"
                                  shape="square"
                                  src={attraction.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100'}
                                  style={{ marginRight: '12px' }}
                                />
                                <div className="flex-1 min-w-0">
                                  <Title level={5} style={{ margin: 0, fontSize: '14px' }}>
                                    {attraction.name}
                                  </Title>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    <ClockCircleOutlined style={{ marginRight: '4px' }} />
                                    {attraction.time} • {attraction.duration}
                                  </Text>
                                </div>
                              </div>
                            ))}
                            {attractions.length > 2 && (
                              <div className="text-center">
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                  还有 {attractions.length - 2} 个景点...
                                </Text>
                              </div>
                            )}
                          </Space>
                        </Card>
                      );
                    })}
                  </Space>

                </div>
              )
            },
            ...days.map((dayKey, index) => ({
              key: dayKey,
              label: `第${index + 1}天`,
              children: (
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <Title level={4} style={{ margin: 0 }}>
                      第{days.indexOf(dayKey) + 1}天详细行程
                    </Title>
                  </div>

                  {/* 单日景点列表 */}
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {(currentItinerary[dayKey] || []).map((attraction, index) => (
                      <DraggableAttractionCard
                        key={attraction.id}
                        attraction={attraction}
                        index={index}
                        onViewExpertArticle={onViewExpertArticle}
                        onFindExperts={onFindExperts}
                        onReplaceAttraction={onReplaceAttraction}
                      />
                    ))}
                  </Space>

                  {(!currentItinerary[dayKey] || currentItinerary[dayKey].length === 0) && (
                    <Card>
                      <div className="text-center py-8">
                        <Text type="secondary">暂无景点安排</Text>
                      </div>
                    </Card>
                  )}
                </div>
              )
            }))
          ]}
        />
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        title="重置行程"
        open={showResetConfirm}
        onOk={handleResetItinerary}
        onCancel={() => setShowResetConfirm(false)}
        okText="确认重置"
        cancelText="取消"
        okType="danger"
      >
        <Text>确定要重置整个行程吗？这将清空所有预约和自定义修改。</Text>
      </Modal>

      {/* Summary Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center">
            <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              行程总览: {days.length} 天，
              共 {Object.values(currentItinerary).reduce((total, day) => total + day.length, 0)} 个景点
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              专家预约: {bookings.length} 个服务
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}