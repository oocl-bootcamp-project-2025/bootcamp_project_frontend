# 地图组件重构说明

## 概述

将原来的单一 `AMapComponent.jsx` 组件按功能拆分为多个独立的组件，提高了代码的可维护性和可复用性。

## 组件结构

### 1. MapContainer (主容器组件)

- **文件**: `MapContainer.jsx` + `css/MapContainer.css`
- **功能**:
  - 管理整体状态和生命周期
  - 协调各子组件之间的通信
  - 处理地图视图的调整逻辑

### 2. MapCore (核心地图组件)

- **文件**: `MapCore.jsx` + `css/MapCore.css`
- **功能**:
  - 负责高德地图的初始化
  - 处理地图加载和错误事件
  - 提供地图实例给其他组件

### 3. MapMarkers (标记管理组件)

- **文件**: `MapMarkers.jsx` + `css/MapMarkers.css`
- **功能**:
  - 管理地图上的所有标记点
  - 处理标记的批量渲染和事件
  - 显示悬停时的信息窗口

### 4. MapRoutes (路线管理组件)

- **文件**: `MapRoutes.jsx` + `css/MapRoutes.css`
- **功能**:
  - 绘制不同天数的路线
  - 管理路线颜色和样式
  - 处理路线规划 API 调用

### 5. MapLoadingStates (状态显示组件)

- **文件**: `MapLoadingStates.jsx` + `css/MapLoadingStates.css`
- **功能**:
  - 显示地图加载中状态
  - 显示错误状态和重试按钮
  - 显示地图更新中状态

### 6. JourneyControls (行程控制组件)

- **文件**: `JourneyControls.jsx` + `css/JourneyControls.css`
- **功能**:
  - 提供行程显示/隐藏切换
  - 管理天数选择控件
  - 处理全选/取消全选逻辑

### 7. AMapComponent (兼容性包装组件)

- **文件**: `AMapComponent.jsx` + `css/AMapComponent.css`
- **功能**:
  - 保持向后兼容性
  - 简单包装 MapContainer 组件
  - 导入所有子组件的样式

## 优势

### 1. 单一职责原则

- 每个组件只负责一个特定的功能
- 代码更易理解和维护

### 2. 可复用性

- 各组件可以独立使用
- 便于在其他项目中复用

### 3. 更好的性能

- 组件按需渲染
- 减少不必要的重新渲染

### 4. 更容易测试

- 每个组件可以独立测试
- 降低测试的复杂度

### 5. 团队协作

- 不同开发者可以并行开发不同组件
- 减少代码冲突

## 使用方式

### 直接使用原组件 (推荐，保持兼容性)

```jsx
import { AMapComponent } from './components/map';

function App() {
  return <AMapComponent />;
}
```

### 使用新的容器组件

```jsx
import { MapContainer } from './components/map';

function App() {
  return <MapContainer />;
}
```

### 自定义组合使用

```jsx
import {
  MapCore,
  MapMarkers,
  MapRoutes,
  JourneyControls,
} from './components/map';

function CustomMapComponent() {
  // 自定义逻辑
  return (
    <div>
      <MapCore onMapReady={handleMapReady} />
      <MapMarkers map={map} locations={locations} />
      <MapRoutes map={map} locations={locations} />
      <JourneyControls {...journeyProps} />
    </div>
  );
}
```

## 文件结构

```
src/components/map/
├── AMapComponent.jsx           # 原组件(兼容性包装)
├── MapContainer.jsx            # 主容器组件
├── MapCore.jsx                 # 核心地图组件
├── MapMarkers.jsx              # 标记管理组件
├── MapRoutes.jsx               # 路线管理组件
├── MapLoadingStates.jsx        # 状态显示组件
├── JourneyControls.jsx         # 行程控制组件
├── Card.jsx                    # 信息卡片组件(原有)
├── JourneyDetail.jsx           # 行程详情组件(原有)
├── index.js                    # 统一导出
└── css/
    ├── AMapComponent.css       # 兼容性样式(导入其他样式)
    ├── MapContainer.css        # 主容器样式
    ├── MapCore.css             # 核心地图样式
    ├── MapMarkers.css          # 标记样式
    ├── MapRoutes.css           # 路线样式
    ├── MapLoadingStates.css    # 状态显示样式
    ├── JourneyControls.css     # 行程控制样式
    ├── Card.css                # 信息卡片样式(原有)
    └── JourneyDetail.css       # 行程详情样式(原有)
```

## 迁移指南

现有代码无需修改，原有的 `AMapComponent` 组件仍然可以正常使用。新的组件架构完全向后兼容。

如果要使用新的组件架构，可以：

1. 直接替换 `AMapComponent` 为 `MapContainer`
2. 或者根据需要选择性使用特定的子组件

## 注意事项

1. 所有子组件都依赖高德地图 API 的全局 `window.AMap` 对象
2. 组件间通过 props 进行通信，保持数据流向清晰
3. 状态管理仍然通过 `JourneyContext` 进行
4. CSS 模块化，避免样式冲突

## 最新更新

### v1.1 - 交互功能优化 (2024-09-22)

#### 🎯 新增功能：

- **点击天数快速跳转**: 点击天数文字（如"第 1 天"）可以只查看该天的景点并自动跳转
- **智能地图视图调整**: 使用高德地图的 `setFitView` 方法自动调整地图视图以包含所有选中的景点
- **用户体验优化**: 添加了使用提示和视觉反馈

#### 🔧 技术改进：

- 在 `JourneyContext` 中新增 `setSelectedDays` 方法，支持直接设置选中天数
- 优化 `MapContainer` 中的 `adjustMapView` 函数，使用边界计算替代简单的中心点计算
- 为天数控件添加点击和悬停的视觉效果

#### 📱 使用方式：

- **复选框**: 用于多选天数（保持原有逻辑）
- **天数文字**: 点击可单独查看该天景点（新功能）
- **自动缩放**: 地图会自动调整到合适的缩放级别以显示所有选中的景点

#### 🎨 界面优化：

- 当前单独选中的天数会高亮显示（蓝色+下划线+加粗）
- 添加工具提示和使用说明
- 鼠标悬停效果更加友好

## 组件调用逻辑详解

### 主要调用流程

```
App.jsx
  └─ Homepage.jsx
      └─ MapContainer.jsx (主入口)
          ├─ MapCore.jsx (地图初始化)
          ├─ MapMarkers.jsx (标记管理)
          ├─ MapRoutes.jsx (路线绘制)
          ├─ MapLoadingStates.jsx (状态显示)
          └─ JourneyControls.jsx (控制面板)
```

### 详细调用关系

#### 1. MapContainer.jsx (主协调器)

**状态管理**:

```javascript
const [map, setMap] = useState(null); // 地图实例
const [showJourney, setShowJourney] = useState(false); // 显示控制
const [mapError, setMapError] = useState(false); // 错误状态
const [isLoading, setIsLoading] = useState(true); // 加载状态
const [isUpdatingView, setIsUpdatingView] = useState(false); // 视图更新状态
```

**Context 调用**:

```javascript
const {
  filteredLocations, // 过滤后的位置数据
  selectedDays, // 选中的天数
  uniqueDays, // 所有天数
  toggleDay, // 切换单天选择
  toggleAll, // 全选/取消全选
  setSelectedDays, // 直接设置选中天数
} = useJourney();
```

**子组件调用**:

```javascript
// 1. 地图核心初始化
<MapCore
  onMapReady={handleMapReady}      // 地图准备完成回调
  onMapError={handleMapError}      // 地图错误回调
  onMapLoading={handleMapLoading}  // 加载状态回调
/>

// 2. 标记管理 (条件渲染：地图就绪后)
{map && (
  <MapMarkers
    map={map}                      // 地图实例
    locations={filteredLocations}  // 位置数据
    onMarkersUpdate={handleMarkersUpdate} // 标记更新回调
    isUpdatingView={isUpdatingView}       // 视图更新状态
  />
)}

// 3. 路线绘制 (条件渲染：地图就绪后)
{map && (
  <MapRoutes
    map={map}                      // 地图实例
    locations={filteredLocations}  // 位置数据
  />
)}

// 4. 状态显示
<MapLoadingStates
  isLoading={isLoading}   // 加载状态
  mapError={mapError}     // 错误状态
  isUpdating={isUpdatingView} // 更新状态
  onRetry={handleRetry}   // 重试回调
/>

// 5. 控制面板
<JourneyControls
  showJourney={showJourney}          // 显示状态
  onToggleJourney={toggleJourney}    // 切换显示
  selectedDays={selectedDays}        // 选中天数
  uniqueDays={uniqueDays}            // 所有天数
  onToggleDay={toggleDay}            // 天数切换
  onToggleAll={toggleAll}            // 全选切换
  onSetSelectedDays={setSelectedDays} // 直接设置
  isUpdatingView={isUpdatingView}    // 更新状态
/>
```

#### 2. MapCore.jsx (地图核心)

**初始化流程**:

```javascript
useEffect(() => {
  // 1. 检查高德地图API是否加载
  if (typeof window.AMap !== 'undefined') {
    initializeMap(); // 直接初始化
  } else {
    // 2. 动态加载高德地图API
    loadAMapScript()
      .then(() => {
        initializeMap();
      })
      .catch(onMapError);
  }
}, []);

// 3. 地图初始化完成后调用父组件回调
const initializeMap = () => {
  try {
    const mapInstance = new window.AMap.Map('container', config);
    onMapReady(mapInstance); // 通知父组件
    onMapLoading(false); // 设置加载完成
  } catch (error) {
    onMapError(error); // 通知错误
  }
};
```

#### 3. MapMarkers.jsx (标记管理)

**更新流程**:

```javascript
useEffect(() => {
  if (!map || !locations) return;

  // 1. 清除旧标记
  clearMarkers();

  // 2. 批量处理新标记 (性能优化)
  const markers = [];
  locations.forEach(location => {
    const marker = createMarker(location);
    markers.push(marker);
  });

  // 3. 添加到地图
  markers.forEach(marker => map.add(marker));

  // 4. 通知父组件标记更新完成
  onMarkersUpdate(markers);
}, [map, locations]);

// 标记创建逻辑
const createMarker = location => {
  const marker = new window.AMap.Marker({
    position: location.position,
    content: createMarkerContent(location), // 自定义内容
    title: location.name,
  });

  // 添加悬停事件
  marker.on('mouseover', () => showInfoWindow(location));
  marker.on('mouseout', hideInfoWindow);

  return marker;
};
```

#### 4. MapRoutes.jsx (路线管理)

**路线绘制流程**:

```javascript
useEffect(() => {
  if (!map || !locations) return;

  // 1. 清除旧路线
  clearRoutes();

  // 2. 按天数分组
  const locationsByDay = groupLocationsByDay(locations);

  // 3. 为每天绘制路线
  Object.entries(locationsByDay).forEach(([day, dayLocations]) => {
    if (dayLocations.length >= 2) {
      drawDayRoute(day, dayLocations);
    }
  });
}, [map, locations]);

// 单天路线绘制
const drawDayRoute = async (day, locations) => {
  try {
    // 1. 调用高德路径规划API
    const routes = await planRoute(locations);

    // 2. 创建路线多边形
    const polyline = new window.AMap.Polyline({
      path: routes,
      strokeColor: getDayColor(day), // 根据天数获取颜色
      strokeWeight: 4,
      strokeOpacity: 0.8,
    });

    // 3. 添加到地图
    map.add(polyline);
    polylines.current.push(polyline);
  } catch (error) {
    console.warn(`Failed to draw route for day ${day}:`, error);
  }
};
```

#### 5. JourneyControls.jsx (控制面板)

**交互处理流程**:

```javascript
// 天数点击处理 (新功能)
const handleDayClick = day => {
  // 1. 设置单独选中该天
  onSetSelectedDays([day]);

  // 2. 触发地图视图调整 (由MapContainer监听selectedDays变化)
};

// 复选框切换处理 (原有功能)
const handleToggleDay = day => {
  // 1. 切换天数选择状态
  onToggleDay(day);

  // 2. 触发地图视图调整
};

// 全选切换处理
const handleToggleAll = () => {
  // 1. 全选或取消全选
  onToggleAll();

  // 2. 触发地图视图调整
};
```

#### 6. 地图视图调整逻辑 (MapContainer.jsx)

**自动调整流程**:

```javascript
useEffect(() => {
  // 1. 监听选中天数变化
  if (hasSelectedDaysChanged && map && filteredLocations.length > 0) {
    // 2. 防抖处理，避免频繁调用
    setIsUpdatingView(true);

    // 3. 筛选有效位置
    const validLocations = filteredLocations.filter(isValidLocation);

    // 4. 调整地图视图
    adjustMapView(validLocations);
  }
}, [selectedDays, filteredLocations, map]);

// 视图调整算法
const adjustMapView = validLocations => {
  // 1. 计算边界范围
  const bounds = calculateBounds(validLocations);

  // 2. 添加边距
  const paddedBounds = addPadding(bounds);

  // 3. 计算最佳缩放级别和中心点
  const { zoom, center } = calculateOptimalView(paddedBounds);

  // 4. 应用到地图
  map.setZoomAndCenter(zoom, center);

  // 5. 延迟更新状态，确保地图渲染完成
  setTimeout(() => {
    setIsUpdatingView(false);
    setPrevSelectedDays([...selectedDays]);
  }, 500);
};
```

### 数据流向图

```
JourneyContext (全局状态)
    ↓ (提供数据)
MapContainer (主控制器)
    ↓ (分发状态和回调)
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  MapCore    │ MapMarkers  │ MapRoutes   │JourneyControls│
│             │             │             │             │
│ ✓初始化地图  │ ✓管理标记    │ ✓绘制路线    │ ✓用户交互     │
│ ✓错误处理   │ ✓批量渲染    │ ✓路径规划    │ ✓状态显示     │
│ ✓加载状态   │ ✓事件绑定    │ ✓颜色管理    │ ✓视图控制     │
└─────────────┴─────────────┴─────────────┴─────────────┘
    ↑ (状态回调)
MapContainer (状态汇总)
    ↑ (触发更新)
JourneyContext (状态更新)
```

### 性能优化策略

1. **条件渲染**: 地图实例准备就绪后才渲染标记和路线组件
2. **批量处理**: 标记更新使用批量处理，减少 DOM 操作
3. **防抖处理**: 视图调整使用防抖，避免频繁 API 调用
4. **状态缓存**: 缓存上一次选中状态，避免重复计算
5. **错误恢复**: 完善的错误处理和重试机制
6. **内存管理**: 组件卸载时清理地图资源和定时器

### 扩展性设计

- **插件化**: 每个子组件都可以独立扩展功能
- **配置化**: 通过 props 传递配置参数
- **事件驱动**: 使用回调函数实现组件间通信
- **状态分离**: 业务状态和 UI 状态分离管理
- **样式模块化**: CSS 模块化避免样式冲突
