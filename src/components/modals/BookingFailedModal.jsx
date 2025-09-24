import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';

const { Text } = Typography;

export default function BookingFailedModal({
  open,
  errorMessage,
  onClose
}) {
  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      closable={true}
      maskClosable={false}
      width={400}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: '16px', color: '#999' }} />}
      onCancel={onClose}
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <ExclamationCircleOutlined
          style={{
            fontSize: '48px',
            color: '#ff4d4f',
            marginBottom: '16px'
          }}
        />

        <div style={{ fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>
          预约失败
        </div>

        <Text style={{ fontSize: '16px', color: '#666' }}>
          {errorMessage}
        </Text>
      </div>
    </Modal>
  );
}