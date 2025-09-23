import { ClockCircleOutlined, EnvironmentOutlined, ExclamationCircleOutlined, MessageOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Empty, Modal, Result, Skeleton, Space, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ClockCircleOutlined, EnvironmentOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Modal, Space, Tag, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertBookingModal from './ExpertBookingModal';
import LoginTipsModal from './LoginTipsModal';

const { Title, Text, Paragraph } = Typography;

export default function ExpertListModal({
  attraction,
  isOpen,
  onClose,
  onSelectExpert
}) {
  const [loading, setLoading] = useState(false);
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState(null);

  // 模拟达人数据
  const mockExperts = [
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

  // 获取达人数据
  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);
      setExperts([]);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟网络错误（景点名称包含"错误"或"网络"时）
      if (attraction?.name && (attraction.name.includes('错误') || attraction.name.includes('网络'))) {
        throw new Error('Network Error');
      }

      // 根据景点名称决定是否有达人数据
      if (attraction?.name && (attraction.name.includes('测试') || attraction.name.includes('空状态'))) {
        // 模拟空状态
        setExperts([]);
      } else {
        // 模拟有数据状态
        setExperts(mockExperts);
      }
      setLoading(false);
    } catch (error) {
      console.error('获取达人数据失败:', error);
      setError(error);
      setLoading(false);
    }
  };

  // 重试函数
  const handleRetry = () => {
    fetchExperts();
  };

  // 模拟数据加载
  useEffect(() => {
    if (isOpen && attraction) {
      fetchExperts();
    }
  }, [isOpen, attraction]);

  // 处理预约
  const [loginModalVisible, setLoginModalVisible] = React.useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [selectedExpert, setSelectedExpert] = React.useState(null);
  const navigate = useNavigate();
  const handleBooking = (expert) => {
    localStorage.removeItem('token');
    //localStorage.setItem('token', 'test-token');
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
    if (onSelectExpert && selectedExpert) {
      onSelectExpert(selectedExpert);
    }
    setConfirmModalVisible(false);
  };

  // 取消预约确认
  const handleCancelBooking = () => {
    setConfirmModalVisible(false);
    setSelectedExpert(null);
  };

  // 处理推荐其他景点
  const handleRecommendOtherAttractions = () => {
    console.log('推荐其他景点');
    // 这里可以添加推荐其他景点的逻辑
    onClose();
  };

  // 骨架屏组件
  const ExpertSkeleton = () => (
    <Card style={{ borderRadius: '12px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Skeleton.Avatar size={64} active />
        <div style={{ flex: 1 }}>
          <Skeleton active>
            <Skeleton.Input style={{ width: '200px', height: '20px' }} active />
            <Skeleton.Input style={{ width: '150px', height: '16px', marginTop: '8px' }} active />
            <div style={{ marginTop: '12px' }}>
              <Skeleton.Button size="small" active style={{ marginRight: '8px' }} />
              <Skeleton.Button size="small" active style={{ marginRight: '8px' }} />
              <Skeleton.Button size="small" active />
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '12px'
            }}>
              <Skeleton.Input style={{ width: '100%', height: '16px' }} active />
              <Skeleton.Input style={{ width: '80%', height: '14px', marginTop: '8px' }} active />
            </div>
            <Skeleton.Button
              style={{ width: '100%', height: '40px', marginTop: '12px' }}
              active
            />
          </Skeleton>
        </div>
      </div>
    </Card>
  );

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Skeleton.Input style={{ width: '300px', height: '16px' }} active />
            <br />
            <Skeleton.Input style={{ width: '150px', height: '12px', marginTop: '4px' }} active />
          </div>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <ExpertSkeleton />
            <ExpertSkeleton />
            <ExpertSkeleton />
          </Space>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Result
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="网络开小差了"
            subTitle="无法获取达人信息，请检查网络连接后重试"
            extra={
              <Space direction="vertical" size="middle">
                <Button
                  type="primary"
                  size="large"
                  style={{
                    background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                    border: 'none',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  onClick={handleRetry}
                >
                  重试
                </Button>
                <Button
                  type="default"
                  size="large"
                  style={{
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '14px'
                  }}
                  onClick={onClose}
                >
                  返回行程
                </Button>
              </Space>
            }
          />
        </div>
      );
    }

    if (experts.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Empty
            image={
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SearchOutlined style={{ fontSize: '48px', color: 'white' }} />
              </div>
            }
            imageStyle={{ marginBottom: '20px' }}
            description={
              <div>
                <Title level={4} style={{ color: '#666', marginBottom: '8px' }}>
                  暂无达人为该景点提供服务
                </Title>
                <Paragraph style={{ color: '#999', marginBottom: '24px' }}>
                  很抱歉，{attraction?.name || '该景点'}暂时没有认证达人提供专业服务。
                  <br />
                  您可以尝试查看其他热门景点的达人服务。
                </Paragraph>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                      border: 'none',
                      borderRadius: '8px',
                      height: '44px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                    onClick={handleRecommendOtherAttractions}
                  >
                    推荐其他景点
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    style={{
                      borderRadius: '8px',
                      height: '44px',
                      fontSize: '14px'
                    }}
                    onClick={onClose}
                  >
                    返回行程
                  </Button>
                </Space>
              </div>
            }
          />
        </div>
      );
    }

    return (
      <div>
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
                    style={{
                      background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '100%',
                      height: '40px',
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleBooking(expert)}
                  >
                    预约达人
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
      </div>
    );
  };

  return (
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
      {renderContent()}

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
    </div>
  );
}