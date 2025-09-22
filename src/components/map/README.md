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
