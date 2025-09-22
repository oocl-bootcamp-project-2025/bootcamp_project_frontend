export default function ExpertArticleModal({ expert, attractionName, isOpen, onClose, onBookServices }) {
  if (!isOpen || !expert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">专家文章</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {/* 专家信息 */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-semibold text-gray-600">
                {expert.name?.[0] || 'E'}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{expert.name}</h3>
              <p className="text-sm text-gray-600">认证达人</p>
            </div>
          </div>
          
          {/* 文章标题 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {expert.articleTitle || `${attractionName} 深度游玩攻略`}
            </h3>
            <p className="text-gray-600">
              {expert.articlePreview || '专业的旅游攻略和建议...'}
            </p>
          </div>
          
          {/* 文章内容 */}
          <div className="prose">
            <p>
              作为一名资深的{attractionName}导游，我在这里分享一些独家的游玩心得和建议。
              这里有着丰富的历史文化底蕴，每一个角落都有着自己的故事。
            </p>
            <p>
              推荐最佳游览时间是上午9-11点，此时人流较少，光线也最适合拍照。
              不要错过隐藏在景区深处的那个小亭子，那里是观景的绝佳位置。
            </p>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              稍后再看
            </button>
            <button
              onClick={() => onBookServices(expert)}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              预约我的服务
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}