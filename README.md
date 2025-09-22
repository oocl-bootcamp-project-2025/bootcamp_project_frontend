
# AI 旅行规划项目

一个基于React的智能旅行规划应用，帮助用户规划个性化的旅行行程。

原始设计稿: https://www.figma.com/design/8iVe9xW4G6CCXDtpqk9kxZ/AI-Travel-Planning-Website

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── pages/          # 页面级组件
│   │   ├── Homepage.jsx
│   │   ├── ItineraryResults.jsx
│   │   ├── AttractionDetailPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   └── ExpertProfilePage.jsx
│   ├── modals/         # 模态框组件
│   │   ├── ExpertArticleModal.jsx
│   │   ├── ExpertBookingModal.jsx
│   │   ├── ExpertListModal.jsx
│   │   └── ServiceSelectionModal.jsx
│   ├── common/         # 通用组件
│   │   ├── DraggableAttractionCard.jsx
│   │   └── BookingSuccessToast.jsx
│   └── ui/            # UI基础组件
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── badge.jsx
│       ├── avatar.jsx
│       ├── dialog.jsx
│       └── separator.jsx
├── hooks/             # 自定义钩子
│   ├── useAppState.js
│   └── useModalState.js
├── utils/             # 工具函数
│   └── index.js
├── constants/         # 常量定义
│   └── index.js
├── styles/           # 样式文件
│   └── globals.css
├── App.jsx          # 主应用组件
└── main.jsx        # 应用入口
```

## 🏗️ 架构设计

### 组件分层
- **页面组件 (Pages)**: 完整的页面级组件，负责整体布局和数据流
- **模态框组件 (Modals)**: 弹窗和对话框组件
- **通用组件 (Common)**: 可复用的功能组件
- **UI组件 (UI)**: 基础UI组件库

### 状态管理
- 使用自定义Hook进行状态管理
- `useAppState`: 应用全局状态
- `useModalState`: 模态框状态管理

### 工具函数
- 日期处理: `getDateOptions`, `calculateDuration`
- 数据处理: `filterCities`, `deepClone`, `generateId`

### 常量管理
- `CHINESE_CITIES`: 中国城市数据
- `TIME_OPTIONS`: 时间选项
- `PAGES`: 页面常量
- `SERVICE_TYPES`: 服务类型

## 🛠️ 技术栈

- **前端框架**: React 18.3.1
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **拖拽功能**: React DnD
- **UI组件**: Radix UI
- **图标**: Lucide React

## 📋 开发规范

### 代码格式化
项目配置了ESLint和Prettier来保持代码风格一致性。

### 组件命名
- 组件文件使用PascalCase命名
- 组件函数使用default export
- Props使用解构赋值

### 文件组织
- 相关功能的组件放在同一目录
- 工具函数按功能分组
- 常量集中管理

## 🔧 开发工具

推荐安装以下VS Code扩展：
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Path Intellisense

## 📈 性能优化

- 使用React.lazy进行代码分割
- 组件优化避免不必要的重渲染
- 图片懒加载
- 合理使用memo和useMemo

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License
  