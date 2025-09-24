import { SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Space, Typography } from 'antd';
import { BUTTON_HEIGHTS, FONT_SIZES, GRADIENTS } from '../constants/styleConstants';

const { Title, Paragraph } = Typography;

/**
 * 空状态组件
 */
export const EmptyState = ({ attraction, onRecommendOtherAttractions, onClose }) => (
  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
    <Empty
      image={
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 20px',
          background: GRADIENTS.blueCircle,
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
                background: GRADIENTS.primary,
                border: 'none',
                borderRadius: '8px',
                height: BUTTON_HEIGHTS.desktop,
                fontSize: FONT_SIZES.xlarge,
                fontWeight: 'bold'
              }}
              onClick={onRecommendOtherAttractions}
            >
              推荐其他景点
            </Button>
            <Button
              type="default"
              size="large"
              style={{
                borderRadius: '8px',
                height: BUTTON_HEIGHTS.desktop,
                fontSize: FONT_SIZES.large
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