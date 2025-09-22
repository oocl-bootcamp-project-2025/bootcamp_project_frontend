export default function ServiceSelectionModal({ expert, isOpen, onClose, onServiceSelected }) {
  if (!isOpen) return null;

  const services = [
    { id: 'guide', name: '导游服务', price: '¥200/天' },
    { id: 'consultation', name: '旅游咨询', price: '¥50/小时' },
    { id: 'planning', name: '行程规划', price: '¥150/次' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">选择服务</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onServiceSelected(expert, service.id)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                </div>
                <span className="text-orange-600 font-semibold">{service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}