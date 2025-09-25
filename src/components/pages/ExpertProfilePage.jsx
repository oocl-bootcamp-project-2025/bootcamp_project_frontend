import { useNavigate } from 'react-router-dom';
import './css/ExpertProfilePage.css';

export default function ExpertProfilePage({ expert }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            ← 返回
          </button>
          <h1 className="text-xl font-bold">专家档案</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-gray-600">
                {expert?.name?.[0] || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {expert?.name || '专家姓名'}
              </h2>
              <p className="text-gray-600">
                评分: {expert?.rating || '5.0'} ⭐
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">专业领域</h3>
            <div className="flex flex-wrap gap-2">
              <span
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
              >
                {expert?.speciality || '旅游咨询'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}