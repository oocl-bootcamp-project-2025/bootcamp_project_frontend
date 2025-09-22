import React, { createContext, useContext, useState } from 'react';

// 创建上下文
const JourneyContext = createContext();

// 上下文提供者组件
export const JourneyProvider = ({ children }) => {
  const [selectedDays, setSelectedDays] = useState([1, 2]); // 默认选中第1天和第2天

  // 添加真实的地点数据，包含正确的position格式
  const locations = [
    { name: '天安门', position: [116.397428, 39.909187], day: 1 },
    { name: '故宫博物院', position: [116.403963, 39.917219], day: 1 },
    { name: '北海公园', position: [116.390895, 39.926623], day: 1 },
    { name: '景山公园', position: [116.397026, 39.927641], day: 1 },
    { name: '颐和园', position: [116.275147, 39.999984], day: 2 },
    { name: '圆明园', position: [116.303511, 40.006626], day: 2 },
    { name: '北京动物园', position: [116.339996, 39.940001], day: 2 },
    { name: '长城', position: [116.015881, 40.356188], day: 3 },
    { name: '十三陵', position: [116.230369, 40.287498], day: 3 },
  ];

  // 获取唯一的天数
  const uniqueDays = [...new Set(locations.map(location => location.day))];

  // 根据选中的天数过滤位置
  const filteredLocations = selectedDays.length === 0
    ? []
    : locations.filter(location => selectedDays.includes(location.day));

  // 切换天数选择
  const toggleDay = (day) => {
    setSelectedDays(prevSelected => {
      if (prevSelected.includes(day)) {
        return prevSelected.filter(d => d !== day);
      } else {
        return [...prevSelected, day];
      }
    });
  };

  // 切换全选
  const toggleAll = () => {
    setSelectedDays(prevSelected => {
      if (prevSelected.length === uniqueDays.length) {
        return [];
      } else {
        return [...uniqueDays];
      }
    });
  };

  return (
    <JourneyContext.Provider value={{
      selectedDays,
      uniqueDays,
      locations,
      filteredLocations,
      toggleDay,
      toggleAll
    }}>
      {children}
    </JourneyContext.Provider>
  );
};

// 自定义钩子以便使用上下文
export const useJourney = () => useContext(JourneyContext);
