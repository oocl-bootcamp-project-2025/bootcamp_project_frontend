export default function AttractionDetailPage({ attraction, onBack }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            ← 返回
          </button>
          <h1 className="text-xl font-bold">景点详情</h1>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">景点图片</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {attraction?.name || '景点名称'}
            </h2>
            <p className="text-gray-600">
              {attraction?.description || '景点描述正在加载中...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}