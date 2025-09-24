import { Button, Modal } from 'antd';
import { GRADIENTS } from '../constants/styleConstants';

/**
 * 小红书链接确认弹窗组件
 */
export const LinkConfirmModal = ({
  visible,
  selectedExpert,
  onConfirm,
  onCancel
}) => (
  <Modal
    title="链接跳转确认"
    open={visible}
    onCancel={onCancel}
    centered
    footer={[
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button
        key="confirm"
        type="primary"
        style={{
          background: GRADIENTS.primary,
          border: 'none'
        }}
        onClick={onConfirm}
      >
        确认
      </Button>
    ]}
  >
    <p>即将打开小红书查看「{selectedExpert?.name}」的主页</p>
    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
      将在新的浏览器标签页中打开
    </p>
  </Modal>
);