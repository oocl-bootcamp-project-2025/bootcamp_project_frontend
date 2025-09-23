# 私途 Sito 设计系统规范

## 概述

私途 Sito 是一个AI驱动的旅行规划平台，专注于为用户提供个性化的深度游体验。我们的设计系统传递专业、可信赖且充满探索乐趣的视觉体验，参考 Apple、Ray-Ban、Airbnb、Midjourney 等品牌的现代化、高端、精致设计理念。

## 品牌色彩

### 主色调
- **品牌橙**: `#FF6B35` - 用于主要按钮、重点强调元素
- **品牌黄**: `#FFC107` - 用于辅助色彩、渐变搭配
- **橙色悬停**: `#e55a2b`
- **黄色悬停**: `#e6ad06`

### 中性色
- **背景色**: `#ffffff`
- **前景色**: `oklch(0.145 0 0)` (深灰色)
- **边框色**: `rgba(0, 0, 0, 0.1)`
- **静音色**: `#ececf0`
- **静音前景**: `#717182`

## Typography 文字层级系统

### 字体规范
- **字体族**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- **字体渲染**: 启用 `text-rendering: optimizeLegibility` 和字体平滑

### 字号系统
```css
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */
--font-size-5xl: 3rem;       /* 48px */
--font-size-6xl: 3.75rem;    /* 60px */
--font-size-7xl: 4.5rem;     /* 72px */
```

### 字重系统
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### 行高系统
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### 文字层级应用

#### Display Typography (展示级)
- **Display Large**: 72px, 800 字重, 紧凑行高
- **Display Medium**: 60px, 700 字重, 紧凑行高  
- **Display Small**: 48px, 600 字重, 舒适行高

#### 标题系统
- **H1**: 36px, 700 字重, 紧凑行高 - 用于页面主标题
- **H2**: 30px, 600 字重, 舒适行高 - 用于板块标题
- **H3**: 24px, 600 字重, 舒适行高 - 用于卡片标题
- **H4**: 20px, 500 字重, 正常行高 - 用于子标题
- **H5**: 18px, 500 字重, 正常行高 - 用于小标题
- **H6**: 16px, 600 字重, 大写 - 用于标签标题

#### 正文文字
- **正文大**: 18px, 400 字重, 舒适行高 - 用于重要描述
- **正文标准**: 16px, 400 字重, 舒适行高 - 用于常规正文
- **正文小**: 14px, 400 字重, 正常行高 - 用于辅助信息
- **说明文字**: 12px, 500 字重, 正常行高 - 用于标签和说明

## Button Components 按钮系统

### 按钮类型与使用场景

#### 1. Premium Button (`.btn-premium`)
**用途**: 主要行动按钮，如"开始智能规划"、"确认预订"
**视觉特征**:
- 橙黄渐变背景 `linear-gradient(135deg, #FF6B35, #FFC107)`
- 白色文字
- 圆角 16px
- 阴影效果，悬停时增强
- 悬停时轻微上移和缩放效果

```css
.btn-premium {
  background: linear-gradient(135deg, var(--brand-orange), var(--brand-yellow));
  padding: 1rem 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}
```

#### 2. Glass Button (`.btn-glass`)
**用途**: 次级操作按钮，现代感强
**视觉特征**:
- 半透明背景 `rgba(255, 255, 255, 0.1)`
- 毛玻璃效果 `backdrop-filter: blur(12px)`
- 半透明边框
- 悬停时增强透明度

#### 3. Outline Premium (`.btn-outline-premium`)
**用途**: 重要但非主要的操作，如"保存行程"
**视觉特征**:
- 透明背景
- 渐变边框
- 悬停时填充渐变背景

#### 4. Minimal Button (`.btn-minimal`)
**用途**: 轻量级操作，如"返回"、"编辑"
**视觉特征**:
- 无背景
- 简洁样式
- 悬停时淡色背景

### 按钮状态
- **默认**: 基础样式
- **悬停**: 阴影增强，轻微变形
- **激活**: 轻微缩放
- **禁用**: 50% 透明度，无交互效果

## Card System 卡片系统

### 卡片类型

#### 1. Premium Card (`.card-premium`)
**用途**: 重要内容容器，如搜索卡片、景点卡片
**特征**:
- 白色渐变背景
- 16px 圆角
- 阴影效果
- 悬停时上移和阴影增强

#### 2. Glass Card (`.card-glass`)
**用途**: 现代感叠加层
**特征**:
- 毛玻璃效果
- 半透明背景和边框
- 16px 圆角

## Input System 输入系统

### 输入框类型

#### 1. Premium Input (`.input-premium`)
**用途**: 主要表单输入
**特征**:
- 灰色背景，聚焦时变白
- 品牌色边框高亮
- 圆角 12px
- 光环效果

#### 2. Glass Input (`.input-glass`)
**用途**: 现代感表单
**特征**:
- 毛玻璃效果
- 半透明样式

## 交互原则

### 动画时长
- **快速交互**: 200ms - 按钮点击、输入框聚焦
- **标准交互**: 300ms - 卡片悬停、模态框
- **慢速交互**: 500ms - 页面转换

### 缓动函数
- **标准**: `ease-out` - 大多数交互
- **弹性**: `ease` - 按钮交互
- **线性**: `linear` - 加载动画

## 间距系统

```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

## 圆角系统

```css
--radius-sm: 4px;    /* 小元素 */
--radius-md: 6px;    /* 标准元素 */
--radius-lg: 8px;    /* 卡片 */
--radius-xl: 12px;   /* 输入框 */
--radius-2xl: 16px;  /* 按钮 */
--radius-3xl: 24px;  /* 大卡片 */
--radius-full: 9999px; /* 圆形 */
```

## 阴影系统

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);           /* 轻微阴影 */
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);            /* 标准阴影 */
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);          /* 明显阴影 */
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1);          /* 强阴影 */
--shadow-2xl: 0 25px 50px rgba(0,0,0,0.25);        /* 最强阴影 */
```

## 使用指南

### DO ✅
- 优先使用设计系统中定义的组件和样式
- 保持一致的视觉层级
- 使用适当的动画增强用户体验
- 确保足够的对比度和可访问性
- 在移动设备上保持响应式设计

### DON'T ❌
- 不要创建与系统不一致的新样式
- 不要过度使用动画效果
- 不要忽略不同状态的设计
- 不要使用过于复杂的交互
- 不要在小屏幕上使用过小的触控目标

## 品牌个性

我们的设计传达以下品牌特质：
- **专业可信**: 通过一致性和精致的细节
- **现代前沿**: 通过玻璃拟态和渐变效果  
- **温暖友好**: 通过品牌橙黄色系
- **探索精神**: 通过动态交互和视觉层次