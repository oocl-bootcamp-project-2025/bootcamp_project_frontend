// JourneyDetail.js
import React, { useState } from 'react';
import './css/JourneyDetail.css'; // 导入样式文件

const JourneyDetail = ({ locations, onToggle }) => {
    const [selectedDays, setSelectedDays] = useState([1, 2]); // 默认选中第1天和第2天

    const handleToggle = (day) => {
        setSelectedDays((prevSelected) => {
            if (prevSelected.includes(day)) {
                return prevSelected.filter(d => d !== day);
            } else {
                return [...prevSelected, day];
            }
        });

        onToggle(day);
    };

    const uniqueDays = [...new Set(locations.map(location => location.day))];

    return (
        <div className="journey-detail">
            <h4>路线切换</h4>
            <label>
                <input
                    type="checkbox"
                    checked={selectedDays.length === uniqueDays.length}
                    onChange={() => {
                        const newSelectedDays = selectedDays.length === uniqueDays.length ? [] : uniqueDays;
                        setSelectedDays(newSelectedDays);
                        onToggle(newSelectedDays);
                    }}
                />
                显示全部
            </label>
            <div>
                {uniqueDays.map(day => (
                    <label key={day}>
                        <input
                            type="checkbox"
                            checked={selectedDays.includes(day)}
                            onChange={() => handleToggle(day)}
                        />
                        第{day}天
                    </label>
                ))}
            </div>
        </div>
    );
};

export default JourneyDetail;
