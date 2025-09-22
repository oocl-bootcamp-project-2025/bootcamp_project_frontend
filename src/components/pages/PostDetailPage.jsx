export default function PostDetailPage({ post, onBack }) {
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
          <h1 className="text-xl font-bold">帖子详情</h1>
        </div>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {post?.title || '帖子标题'}
            </h2>
            <div className="text-sm text-gray-500 mb-4">
              作者: {post?.author?.name || '用户'}
            </div>
            <div className="prose">
              <p>{post?.content || '帖子内容正在加载中...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}