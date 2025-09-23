import { Button, Modal } from 'antd';

export default function LoginTipsModal({
  open,
  onCancel,
  onLogin
}) {
  return (
    <Modal
      title="请先登录后再进行预约"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}
          style={{
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
          取消
        </Button>,
        <Button key="login" type="primary" onClick={onLogin}
          style={{
            background: 'linear-gradient(to right, #ff6b35, #f7931e)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
          去登录
        </Button>,
      ]}
    >
    </Modal>
  );
}