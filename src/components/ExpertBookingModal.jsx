export default function ExpertBookingModal({ expert, isOpen, onClose, onConfirmBooking }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirmBooking) {
      onConfirmBooking({
        expert,
        date: new Date(),
        time: '10:00',
        service: '导游服务',
        serviceDetails: {
          name: '导游服务',
          price: '¥200/天'
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">预约确认</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">专家信息</h3>
            <p>{expert?.name || '专家'}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">服务详情</h3>
            <p>导游服务 - ¥200/天</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">预约时间</h3>
            <p>今天 10:00</p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              确认预约
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}