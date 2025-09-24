import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Result, Space } from 'antd';
import { BUTTON_HEIGHTS, FONT_SIZES, GRADIENTS } from '../constants/styleConstants';

/**
 * 错误状态组件
 */
export const ErrorState = ({ onRetry, onClose }) => (
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
              background: GRADIENTS.primary,
              border: 'none',
              borderRadius: '8px',
              height: BUTTON_HEIGHTS.desktop,
              fontSize: FONT_SIZES.xlarge,
              fontWeight: 'bold'
            }}
            onClick={onRetry}
          >
            重试
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
      }
    />
  </div>
);