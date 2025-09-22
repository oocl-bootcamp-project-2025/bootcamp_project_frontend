export default function ExpertListModal({ attraction, isOpen, onClose, onSelectExpert }) {
  if (!isOpen) return null;

  const experts = [
    {
      id: '1',
      name: '张导游',
      avatar: '',
      rating: 4.8,
      specialties: ['文化历史', '摄影']
    },
    {
      id: '2', 
      name: '李老师',
      avatar: '',
      rating: 4.9,
      specialties: ['本地美食', '购物']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">选择专家</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {experts.map((expert) => (
            <div
              key={expert.id}
              onClick={() => onSelectExpert(expert)}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-gray-600">
                    {expert.name[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{expert.name}</h3>
                  <p className="text-sm text-gray-600">
                    评分: {expert.rating} ⭐
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {expert.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}