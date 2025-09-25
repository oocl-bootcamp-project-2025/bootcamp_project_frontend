import { useAppContext } from '../../context/AppProvider';
import { ExpertListModal } from '../modals';

export default function ModalManager() {
  const {
    selectedAttraction,
    isExpertListOpen,
    closeExpertList,
    addBooking
  } = useAppContext();

  // 处理专家选择 及预约信息
  const handleSelectExpert = (attraction, bookingInfo) => {
    if (bookingInfo.cancelled) {
      const attractionId = attraction?.id || attraction?.name;
      cancelBooking(bookingInfo.expertId, null, attractionId);
    }
    else if (bookingInfo && bookingInfo.expertName) {
      // 添加预约信息到全局状态
      addBooking({
        attraction,
        expert: {
          name: bookingInfo.expertName,
          id: bookingInfo.expertId
        },
        service: bookingInfo.serviceName,
        time: bookingInfo.bookingDateTime
      });
    }
    closeExpertList();
  };

  return (
    <>
      {/* 专家列表模态框 */}
      <ExpertListModal
        attraction={selectedAttraction}
        isOpen={isExpertListOpen}
        onClose={closeExpertList}
        onSelectExpert={handleSelectExpert}
      />
    </>
  );
}