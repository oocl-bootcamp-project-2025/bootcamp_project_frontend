import { EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Space, Tag, Typography } from 'antd';
import {
  COLORS,
  FONT_SIZES,
  SPACING
} from '../constants/styleConstants';
import {
  getAvatarSize,
  getResponsiveFontSize,
  handleAvatarClick
} from '../utils/expertUtils';

const { Title, Text, Paragraph } = Typography;

/**
 * 达人卡片组件
 */
export const ExpertCard = ({
  expert,
  onBooking,
  onCancelBooking,
  disabled,
  isBooked,
  setSelectedExpertForLink,
  setLinkConfirmVisible
}) => {
  return (
    <Card
      hoverable
      style={{ borderRadius: '12px' }}
      bodyStyle={{ padding: SPACING.large }}
    >
      <div>
        {/* 达人基本信息 - 头像和基本资料 */}
        <div style={{
          display: 'flex',
          gap: SPACING.medium,
          marginBottom: SPACING.medium
        }}>
          {/* 达人头像 */}
          <div style={{ flexShrink: 0, position: 'relative' }}>
            <Avatar
              size={getAvatarSize()}
              src={expert.avatar}
              icon={<UserOutlined />}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onClick={() => handleAvatarClick(expert, setSelectedExpertForLink, setLinkConfirmVisible)}
            />
          </div>

          {/* 达人基本信息 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 基本信息 */}
            <div style={{ marginBottom: SPACING.small }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Title level={5} style={{
                  margin: 0,
                  fontSize: getResponsiveFontSize(14, 16),
                  lineHeight: 1.2
                }}>{expert.name}</Title>
                {expert.verified && (
                  <Tag color="blue" style={{
                    fontSize: FONT_SIZES.small,
                    padding: '1px 4px',
                    lineHeight: 1.2
                  }}>认证达人</Tag>
                )}
              </div>

              <Space size="small" style={{ fontSize: '11px', color: COLORS.gray }}>
                <span>
                  <EnvironmentOutlined style={{ marginRight: '2px', fontSize: FONT_SIZES.small }} />
                  {expert.location}
                </span>
              </Space>
            </div>

            {/* 专长标签 */}
            <div>
              <Space wrap size="small">
                {typeof expert.specialties === 'string' ? (
                  <Tag color="orange" style={{
                    fontSize: FONT_SIZES.small,
                    padding: '1px 4px',
                    lineHeight: 1.2
                  }}>
                    {expert.specialties}
                  </Tag>
                ) : (
                  expert.specialties?.map((specialty, index) => (
                    <Tag key={index} color="orange" style={{
                      fontSize: FONT_SIZES.small,
                      padding: '1px 4px',
                      lineHeight: 1.2
                    }}>
                      {specialty}
                    </Tag>
                  ))
                )}
              </Space>
            </div>
          </div>
        </div>

        {/* 服务信息 - 占据整个卡片宽度 */}
        <div style={{
          backgroundColor: COLORS.lightGray,
          padding: SPACING.medium,
          borderRadius: '8px',
          marginBottom: SPACING.medium,
          width: '100%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.small }}>
            <Text strong style={{
              fontSize: getResponsiveFontSize(14, 16),
              lineHeight: 1.3
            }}>{expert.service.name}</Text>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                color: COLORS.primary,
                fontWeight: 'bold',
                fontSize: getResponsiveFontSize(14, 16)
              }}>
                {expert.service.price}
              </div>
            </div>
          </div>
          <Paragraph
            style={{
              margin: 0,
              fontSize: '13px',
              color: COLORS.gray,
              lineHeight: 1.4
            }}
            ellipsis={{ rows: 2 }}
          >
            {expert.service.description}
          </Paragraph>
        </div>

        {/* 预约/已預約按钮 */}
        {isBooked ? (
          <div style={{
            display: 'flex',
            gap: SPACING.small,
            justifyContent: 'space-between'
          }}>
            <Button
              type="primary"
              disabled={disabled}
              style={{
                background: '#ccc',
                border: 'none',
                borderRadius: '8px',
                flex: 1,
                height: '40px',
                fontWeight: 'bold'
              }}
            >
              已预约
            </Button>
            <Button
              style={{
                background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                flex: 1,
                borderRadius: '8px',
                height: '40px'
              }}
              onClick={() => onCancelBooking(expert)}
            >
              取消预约
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              disabled={disabled}
              style={{
                background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                border: 'none',
                borderRadius: '8px',
                width: '60%',
                height: '40px',
                fontWeight: 'bold'
              }}
              onClick={() => !disabled && onBooking(expert)}
            >
              预约达人
            </Button>
          </div>)}

      </div>
    </Card>
  );
};