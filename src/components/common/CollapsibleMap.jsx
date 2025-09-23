import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/card';
import './css/CollapsibleMap.css';
import AMapComponent from '../map/AMapComponent';

export default function CollapsibleMap({ searchData, itinerary }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 计算景点总数
  const totalAttractions = Object.values(itinerary || {}).flat().length;

  return (
    <div className="collapsible-map">
      {/* 地图折叠控制头部 */}
      <Card className="map-card">
        <button onClick={toggleExpanded} className="map-header-button">
          <div className="flex items-center">
            <div className="map-icon-container">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="map-header-info">
              <h3 className="map-title">
                {searchData?.destination || '北京'} 行程地图
              </h3>
              <p className="map-subtitle">
                {isExpanded ? '点击收起地图' : '点击查看行程地图'}
              </p>
            </div>
          </div>

          <div className="map-header-tags">
            {/* 评分标签 */}
            <div className="rating-tag">
              <span>4.8</span>
              <span>★</span>
            </div>

            {/* 景点数量标签 */}
            {totalAttractions > 0 && (
              <div className="attraction-count-tag">
                <span>{totalAttractions}</span>
                <span>景点</span>
              </div>
            )}

            {/* 展开/收起图标 */}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* 可折叠的地图区域 - 替换为AMapComponent */}
        <div className={`map-content-area ${isExpanded ? 'map-content-expanded' : 'map-content-collapsed'}`}>
          <div className="map-content-container">
            {isExpanded && (
              <div className="map-display-area">
                <AMapComponent />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}