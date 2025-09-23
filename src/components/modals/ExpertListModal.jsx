import React from 'react';
import { Modal, Card, Avatar, Tag, Button, Space, Typography } from 'antd';
import { UserOutlined, EnvironmentOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';

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
  const handleBooking = (expert) => {
    console.log('预约达人:', expert.name);
    // 这里可以添加预约逻辑
    if (onSelectExpert) {
      onSelectExpert(expert);
    }
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
    </Modal>
  );
}