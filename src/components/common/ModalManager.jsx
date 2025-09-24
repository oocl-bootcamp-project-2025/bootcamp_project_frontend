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
    if (bookingInfo) {
      // 添加预约信息到全局状态
      addBooking({
        attraction,
        expert: {
          name: bookingInfo.expertName
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