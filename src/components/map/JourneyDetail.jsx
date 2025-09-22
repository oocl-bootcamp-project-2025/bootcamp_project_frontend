// JourneyDetail.js
import React from 'react';
import './css/JourneyDetail.css'; // 导入样式文件
import { useJourney } from '../../context/JourneyContext';
import AMapComponent from './AMapComponent';

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

            {/* 在同一页面显示地图组件 */}
            <div className="map-container">
                <AMapComponent />
            </div>
        </div>
    );
};

export default JourneyDetail;
