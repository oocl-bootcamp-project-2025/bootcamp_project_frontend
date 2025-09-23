import { ClockCircleOutlined, EnvironmentOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Modal, Space, Tag, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookingSuccessModal from './BookingSuccessModal';
import ExpertBookingModal from './ExpertBookingModal';
import LoginTipsModal from './LoginTipsModal';

const { Title, Text, Paragraph } = Typography;

export default function ExpertListModal({
  attraction,
  isOpen,
  onClose,
  onSelectExpert
}) {

  // 模拟达人数据 - 简化版本
  const experts = [
    {
      id: '1',
      name: '张导游',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      location: '北京',
      articlesCount: 28,
      specialties: ['文化历史', '摄影', '故宫专家'],
      service: {
        name: '专业文化导游服务',
        price: '¥300/天',
        duration: '8小时',
        description: '深度讲解历史文化背景，提供专业摄影指导'
      }
    },
    {
      id: '2',
      name: '李美食家',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=150&h=150&fit=crop&crop=face',
      verified: true,
      location: '北京',
      articlesCount: 42,
      specialties: ['本地美食', '购物', '网红打卡'],
      service: {
        name: '美食购物向导',
        price: '¥250/天',
        duration: '6小时',
        description: '带你品尝地道美食，发现隐藏好店'
      }
    },
    {
      id: '3',
      name: '王摄影师',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: false,
      location: '北京',
      articlesCount: 15,
      specialties: ['摄影指导', '私人定制'],
      service: {
        name: '专业旅拍服务',
        price: '¥400/天',
        duration: '4小时',
        description: '专业摄影师陪同，记录你的美好旅程'
      }
    }
  ];

  // 处理预约
  const [loginModalVisible, setLoginModalVisible] = React.useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [selectedExpert, setSelectedExpert] = React.useState(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [bookedExperts, setBookedExperts] = React.useState([]);

  const navigate = useNavigate();
  const handleBooking = (expert) => {
    //localStorage.removeItem('token');
    localStorage.setItem('token', 'test-token');
    const isLoggedIn = !!localStorage.getItem('token'); // 假设用 token 判断登录
    console.log('登录状态:', isLoggedIn);
    if (!isLoggedIn) {
      setLoginModalVisible(true);
      return;
    }
    setSelectedExpert(expert);
    setConfirmModalVisible(true);
  };

  // 登录弹窗
  const handleGoLogin = () => {
    setLoginModalVisible(false);
    navigate('/login');
  };

  const handleCancelLoginModal = () => {
    setLoginModalVisible(false);
  };

  // 处理确认预约
  const handleConfirmBooking = () => {
    if (selectedExpert) {
      setBookedExperts([...bookedExperts, selectedExpert.id]);
      if (onSelectExpert) {
        onSelectExpert(selectedExpert);
      }
      setConfirmModalVisible(false);
      setShowSuccessModal(true);
    }
  };

  const handleContinuePlanning = () => {
    setShowSuccessModal(false);
    onClose();
  };

  // 取消预约确认
  const handleCancelBooking = () => {
    setConfirmModalVisible(false);
    setSelectedExpert(null);
  };

  return (
    <div>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EnvironmentOutlined style={{ color: '#ff6b35' }} />
            <span>{attraction?.name || '景点'} 当地达人</span>
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={600}
        centered
        styles={{
          body: { maxHeight: '70vh', overflowY: 'auto' }
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary">发现专业的当地向导，获得独特的旅行体验</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            共找到 {experts.length} 位可用达人
          </Text>
        </div>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {experts.map((expert) => (
            <Card
              key={expert.id}
              hoverable
              style={{ borderRadius: '12px' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* 达人头像 */}
                <div style={{ flexShrink: 0 }}>
                  <Avatar
                    size={64}
                    src={expert.avatar}
                    icon={<UserOutlined />}
                    style={{ border: expert.verified ? '2px solid #1677ff' : 'none' }}
                  />
                  {expert.verified && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#1677ff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}>
                      <span style={{ color: 'white', fontSize: '10px' }}>✓</span>
                    </div>
                  )}
                </div>

                {/* 达人信息 */}
                <div style={{ flex: 1 }}>
                  {/* 基本信息 */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Title level={5} style={{ margin: 0 }}>{expert.name}</Title>
                      {expert.verified && (
                        <Tag color="blue" style={{ fontSize: '10px' }}>认证达人</Tag>
                      )}
                    </div>

                    <Space size="middle" style={{ fontSize: '12px', color: '#666' }}>
                      <span>
                        <MessageOutlined style={{ marginRight: '4px' }} />
                        {expert.articlesCount}篇
                      </span>
                      <span>
                        <EnvironmentOutlined style={{ marginRight: '4px' }} />
                        {expert.location}
                      </span>
                    </Space>
                  </div>

                  {/* 专长标签 */}
                  <div style={{ marginBottom: '12px' }}>
                    <Space wrap>
                      {expert.specialties.map((specialty, index) => (
                        <Tag key={index} color="orange" style={{ fontSize: '11px' }}>
                          {specialty}
                        </Tag>
                      ))}
                    </Space>
                  </div>

                  {/* 服务信息 */}
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <Text strong>{expert.service.name}</Text>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#ff6b35', fontWeight: 'bold' }}>
                          {expert.service.price}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center' }}>
                          <ClockCircleOutlined style={{ marginRight: '2px' }} />
                          {expert.service.duration}
                        </div>
                      </div>
                    </div>
                    <Paragraph
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#666'
                      }}
                      ellipsis={{ rows: 2 }}
                    >
                      {expert.service.description}
                    </Paragraph>
                  </div>

                  {/* 预约按钮 */}
                  <Button
                    type="primary"
                    disabled={bookedExperts.includes(expert.id)}
                    style={{
                      background: bookedExperts.includes(expert.id)
                        ? '#ccc'
                        : 'linear-gradient(to right, #ff6b35, #f7931e)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '100%',
                      height: '40px',
                      fontWeight: 'bold'
                    }}
                    onClick={() => !bookedExperts.includes(expert.id) && handleBooking(expert)}
                  >
                    {bookedExperts.includes(expert.id) ? '已预约' : '预约达人'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </Space>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#fafafa',
          borderRadius: '8px'
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            点击预约达人按钮即可直接预约专业服务
          </Text>
        </div>
      </Modal>

      {/* 登录提示弹窗 */}
      <LoginTipsModal
        open={loginModalVisible}
        onCancel={handleCancelLoginModal}
        onLogin={handleGoLogin}
      />

      {/* 预约确认弹窗 */}
      <ExpertBookingModal
        open={confirmModalVisible}
        onCancel={handleCancelBooking}
        onConfirm={handleConfirmBooking}
        date="2025年9月22日星期一"
        startTime="13:30"
        endTime="15:00"
        serviceName={selectedExpert?.service.name}
        price={selectedExpert?.service.price}
      />

      {/* 预约成功弹窗 */}
      <BookingSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        expertName={selectedExpert?.name}
        serviceName={selectedExpert?.service.name}
        bookingDateTime={`2025年9月22日星期一 13:30-15:00`}
        onContinuePlanning={handleContinuePlanning}
      />
    </div>
  );
}