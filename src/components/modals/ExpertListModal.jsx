import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { ExpertCard } from './components/ExpertCard';
import { ExpertSkeleton } from './components/ExpertSkeleton';
import { LinkConfirmModal } from './components/LinkConfirmModal';
import { COLORS, SPACING } from './constants/styleConstants';
import { useExperts } from './hooks/useExperts';
import {
  handleCancelOpenLink,
  handleConfirmOpenLink
} from './utils/expertUtils';

import { EnvironmentOutlined } from '@ant-design/icons';
import { Modal, Skeleton, Space, Typography } from 'antd';
import BookingFailedModal from './BookingFailedModal';
import BookingSuccessModal from './BookingSuccessModal';
import ExpertBookingModal from './ExpertBookingModal';
import LoginTipsModal from './LoginTipsModal';
const { Text } = Typography;

export default function ExpertListModal({
  attraction,
  isOpen,
  onClose,
  onSelectExpert
}) {
  const {
    loading,
    experts,
    error,
    loginModalVisible,
    confirmModalVisible,
    selectedExpert,
    bookingSuccessVisible,
    linkConfirmVisible,
    selectedExpertForLink,
    bookedExperts,
    showFailedModal,
    handleCloseFailedModal,
    setLinkConfirmVisible,
    setSelectedExpertForLink,
    handleRetry,
    handleBooking,
    handleGoLogin,
    handleCancelLoginModal,
    handleConfirmBooking,
    handleCancelBooking,
    handleContinuePlanning,
    handleRecommendOtherAttractions
  } = useExperts(attraction, isOpen, onClose, onSelectExpert);  // 渲染内容
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
      return <ErrorState onRetry={handleRetry} onClose={onClose} />;
    }

    if (experts.length === 0) {
      return (
        <EmptyState
          attraction={attraction}
          onRecommendOtherAttractions={handleRecommendOtherAttractions}
          onClose={onClose}
        />
      );
    }

    return (
      <div>
        <div style={{ marginBottom: SPACING.large }}>
          <Text type="secondary">发现专业的当地向导，获得独特的旅行体验</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            共找到 {experts.length} 位可用达人
          </Text>
        </div>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onBooking={handleBooking}
              disabled={bookedExperts.includes(expert.id)}
              isBooked={bookedExperts.includes(expert.id)}
              setSelectedExpertForLink={setSelectedExpertForLink}
              setLinkConfirmVisible={setLinkConfirmVisible}
            />
          ))}
        </Space>

        <div style={{
          textAlign: 'center',
          marginTop: SPACING.xlarge,
          padding: SPACING.large,
          backgroundColor: COLORS.background,
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
    <div>
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
      </Modal>

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

      {/* 预约成功弹窗 */}
      <BookingSuccessModal
        open={bookingSuccessVisible}
        onContinuePlanning={handleContinuePlanning}
        expertName={selectedExpert?.name}
        serviceName={selectedExpert?.service.name}
        bookingDateTime={`2025年9月22日星期一 13:30-15:00`}
      />

      {/* 预约失败弹窗 */}
      <BookingFailedModal
        open={showFailedModal}
        errorMessage="网络宕机了，请重新预约"
        onClose={handleCloseFailedModal}
      />

      {/* 小红书链接确认弹窗 */}
      <LinkConfirmModal
        visible={linkConfirmVisible}
        selectedExpert={selectedExpertForLink}
        onConfirm={() => handleConfirmOpenLink(selectedExpertForLink, setLinkConfirmVisible, setSelectedExpertForLink)}
        onCancel={() => handleCancelOpenLink(setLinkConfirmVisible, setSelectedExpertForLink)}
      />
    </div>
  );
}