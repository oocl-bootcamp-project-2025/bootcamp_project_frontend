import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/card';
import './css/CollapsibleMap.css';

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

        {/* 可折叠的地图区域 */}
        <div className={`map-content-area ${isExpanded ? 'map-content-expanded' : 'map-content-collapsed'}`}>
          <div className="map-content-container">
            {isExpanded && (
              <div className="map-display-area">
                {/* 简化的地图显示区域 */}
                <div className="map-placeholder">
                  <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <h4 className="map-placeholder-title">
                    {searchData?.destination || '北京'} 地图
                  </h4>
                  <p className="map-placeholder-subtitle">
                    显示 {Object.keys(itinerary || {}).length} 天行程路线
                  </p>
                  <p className="map-placeholder-description">
                    {totalAttractions} 个景点 • 完整地图功能开发中
                  </p>
                </div>

                {/* 右上角的控制按钮组 */}
                <div className="map-controls">
                  {/* 我的位置按钮 */}
                  <button className="map-control-button">
                    <div className="location-button-dot"></div>
                  </button>

                  {/* 放大按钮 */}
                  <button className="map-control-button zoom-button">
                    +
                  </button>

                  {/* 缩小按钮 */}
                  <button className="map-control-button zoom-button">
                    −
                  </button>

                  {/* 导航按钮 */}
                  <button className="map-control-button">
                    <div className="navigation-icon">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                  </button>
                </div>

                {/* 景点标记示例 - 基于实际行程数据 */}
                {Object.entries(itinerary || {}).map(([dayKey, attractions], dayIndex) =>
                  attractions.map((attraction, attractionIndex) => (
                    <div
                      key={`${dayKey}-${attractionIndex}`}
                      className="attraction-marker"
                      style={{
                        top: `${25 + dayIndex * 15 + attractionIndex * 8}%`,
                        left: `${30 + dayIndex * 10 + attractionIndex * 5}%`
                      }}
                    >
                      {dayIndex + 1}
                      {/* 景点名称提示 */}
                      <div className="attraction-tooltip">
                        {attraction.name}
                      </div>
                    </div>
                  ))
                )}

                {/* 连接线示例 */}
                <svg className="route-lines">
                  {Object.entries(itinerary || {}).map(([dayKey, attractions], dayIndex) => {
                    if (attractions.length < 2) return null;

                    return attractions.slice(0, -1).map((_, attractionIndex) => {
                      const startX = 30 + dayIndex * 10 + attractionIndex * 5;
                      const startY = 25 + dayIndex * 15 + attractionIndex * 8;
                      const endX = 30 + dayIndex * 10 + (attractionIndex + 1) * 5;
                      const endY = 25 + dayIndex * 15 + (attractionIndex + 1) * 8;

                      return (
                        <line
                          key={`${dayKey}-line-${attractionIndex}`}
                          x1={`${startX}%`}
                          y1={`${startY}%`}
                          x2={`${endX}%`}
                          y2={`${endY}%`}
                          stroke="#f97316"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.7"
                        />
                      );
                    });
                  })}
                </svg>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}