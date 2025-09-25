import { Button, Modal, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ExpertBookingModal({
  open,
  onCancel,
  onConfirm,
  date,
  serviceName,
  price
}) {

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      closeIcon={
        <Button
          type="text"
          onClick={onCancel}
          style={{
            color: '#ff6b35',
            fontSize: '15px',
            fontWeight: 'bold'
          }}
        >
          取消
        </Button>
      }
      width={400}
      centered
    >
      <div style={{ padding: '20px' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
          预约信息确认
        </Title>


        <div style={{ marginBottom: '24px' }}>
          <div style={{
            background: '#fff8f6',
            padding: '16px'
          }}>

            <div style={{ marginBottom: '20px' }}>
              <Text strong style={{ fontSize: '16px' }}>预约日期和时间</Text>
              <div style={{ marginTop: '8px', color: '#666' }}>
                {date}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Text strong style={{ fontSize: '16px' }}>服务内容</Text>
              <div style={{ marginTop: '8px', color: '#666' }}>
                {serviceName}
              </div>
            </div>
            <Text style={{ fontSize: '16px' }}>费用：</Text>
            <Text style={{
              color: '#ff6b35',
              fontSize: '20px',
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>
              {price}
            </Text>
          </div>
        </div>

        <Button
          type="primary"
          block
          size="large"
          onClick={onConfirm}
          style={{
            background: 'linear-gradient(to right, #ff6b35, #f7931e)',
            border: 'none',
            borderRadius: '8px',
            height: '48px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          确认预约
        </Button>

        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '12px',
          color: '#999'
        }}>
          点击确认预约表示您同意我们的服务条款和隐私政策
        </div>
      </div>
    </Modal>
  );
}