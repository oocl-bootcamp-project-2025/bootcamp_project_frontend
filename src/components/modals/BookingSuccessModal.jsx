import { Button, Modal, Typography } from 'antd';
import { useEffect } from 'react';

const { Text } = Typography;

export default function BookingSuccessModal({
  open,
  expertName,
  serviceName,
  bookingDateTime,
  onContinuePlanning
}) {

  useEffect(() => {
    if (open) {
      window.scrollTo(0, 0);
    }
  }, [open]);

  const handleContinuePlanning = () => {
    // 调用父组件的继续规划方法，并传递预约信息
    onContinuePlanning({
      expertName,
      serviceName,
      bookingDateTime
    });
  };

  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      width={400}
      centered
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div strong style={{ fontSize: '30px', marginBottom: '16px' }}>
          ✨ 预约成功！
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{
            background: '#fff8f6',
            padding: '16px'
          }}>

            <div style={{ marginBottom: '20px' }}>
              <Text strong style={{ fontSize: '16px' }}>已预约达人：{expertName}</Text>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Text strong style={{ fontSize: '16px' }}>预约服务为：{serviceName}</Text>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Text strong style={{ fontSize: '16px' }}>预约时间为：{bookingDateTime}</Text>
            </div>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={handleContinuePlanning}
          style={{
            background: 'linear-gradient(to right, #ff6b35, #f7931e)',
            border: 'none',
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          继续规划行程
        </Button>
      </div>
    </Modal>
  );
}