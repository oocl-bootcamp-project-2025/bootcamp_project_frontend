// JourneyDetail.js
import React from 'react';
import './css/JourneyDetail.css'; // 导入样式文件
import { useJourney } from '../../context/JourneyContext';

// 我们将AMapComponent作为主组件，不再在JourneyDetail中包含地图
const JourneyDetail = () => {
    const { selectedDays, uniqueDays, toggleDay, toggleAll } = useJourney();

    return (
        <div className="journey-container">
            <div className="journey-detail">
                <h4>路线切换</h4>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.length === uniqueDays.length}
                        onChange={toggleAll}
                    />
                    显示全部
                </label>
                <div>
                    {uniqueDays.map(day => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                checked={selectedDays.includes(day)}
                                onChange={() => toggleDay(day)}
                            />
                            第{day}天
                        </label>
                    ))}
                </div>
            </div>
            {/* 移除了这里对AMapComponent的引用 */}
        </div>
    );
};

export default JourneyDetail;
