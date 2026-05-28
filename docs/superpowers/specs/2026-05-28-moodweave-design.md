# MoodWeave — 灵感情绪板工具 设计文档

> 创建日期：2026-05-28
> 状态：已批准

## 1. 项目概述

**MoodWeave** 是一个轻量、优雅的在线灵感情绪板（Mood Board）工具。用户可以通过拖拽图片和文字卡片的方式，快速拼贴视觉灵感，并导出为图片分享。

### 目标

- MVP 首版在碎片化时间内快速交付
- 视觉效果出众，适合在 GitHub 上展示
- 代码清晰可维护，便于持续迭代

## 2. 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建 | Vite |
| 语言 | TypeScript |
| 样式 | CSS 变量 + 局部样式（Scoped CSS），暂不引入 UI 组件库 |
| 状态管理 | Vue composables (useBoard, useCanvas) |
| 持久化 | localStorage |
| 包管理 | npm |
| 代码管理 | Git + GitHub |

## 3. 设计决策

### 3.1 布局：侧边栏 + 画布（双栏效率）

- 左侧：固定宽度侧边栏，包含项目管理和素材库
- 右侧：自由画布区域，支持缩放和平移
- 顶部：浮动工具栏（Figma 风格），不占用画布空间

### 3.2 视觉风格：暗色潮酷 · 霓虹冲击

- 背景色：深色（`#1A1A2E` / `#16213E`）
- 主色调：霓虹蓝（`#0F3460`）、霓虹红（`#E94560`）、紫色（`#533483`）
- 卡片：半透明毛玻璃效果（`backdrop-filter: blur`）
- 文字：白色为主，霓虹色作为点缀和高亮

### 3.3 数据存储：localStorage

- 所有数据保存在浏览器本地
- 支持多 Board（情绪板）切换
- 后续可扩展导出/导入 JSON 备份功能

## 4. MVP 功能范围

### 画布区
- 自由拖拽放置图片卡片和文字卡片
- 卡片支持选中、拖拽移动、删除
- 画布可缩放（Zoom In/Out）
- 画布可平移（Pan）

### 侧边栏（素材库）
- 已添加的素材缩略图列表
- 点击缩略图，画布自动定位并高亮对应卡片

### 浮动工具栏
- ➕ 添加图片（本地上传 / URL 粘贴）
- 🔤 添加文字卡片
- 🗑️ 删除选中元素
- 💾 导出为 PNG 图片

### 项目管理
- 创建新的情绪板（Board）
- 切换已有 Board
- 删除 Board
- 重命名 Board

## 5. 组件架构

```
App.vue
├── TopToolbar.vue              ← 浮动工具栏
│   ├── AddImageBtn.vue         ← 添加图片按钮+弹窗
│   ├── AddTextBtn.vue          ← 添加文字按钮
│   ├── DeleteBtn.vue           ← 删除选中
│   └── ExportBtn.vue           ← 导出 PNG
├── MainLayout.vue              ← 双栏布局容器
│   ├── Sidebar.vue             ← 左侧边栏
│   │   ├── BoardManager.vue    ← 项目列表（CRUD）
│   │   └── AssetLibrary.vue    ← 素材缩略图列表
│   └── CanvasArea.vue          ← 右侧画布容器
│       ├── CanvasBoard.vue     ← 画布（缩放/平移/坐标系统）
│       ├── ImageCard.vue       ← 图片卡片（拖拽/选中/删除）
│       └── TextCard.vue        ← 文字卡片（拖拽/选中/删除/编辑）
└── EditModal.vue               ← 文字编辑弹窗
```

## 6. 数据模型

```typescript
interface Board {
  id: string;
  name: string;
  cards: Card[];
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}

interface Card {
  id: string;
  type: 'image' | 'text';
  x: number;           // 画布上的 X 坐标
  y: number;           // 画布上的 Y 坐标
  width: number;
  height: number;
  content: string;     // 图片 URL 或 文字内容
  zIndex: number;
}

// localStorage 数据结构
interface StorageData {
  boards: Board[];
  activeBoardId: string | null;
}
```

## 7. 核心 Composables

### useBoard.ts
- `loadBoards()` / `saveBoards()` — localStorage 读写
- `currentBoard` — 当前激活的 Board（响应式）
- `createBoard(name)` / `deleteBoard(id)` / `renameBoard(id, name)`
- `switchBoard(id)` — 切换当前 Board

### useCanvas.ts
- `cards` — 当前 Board 的卡片列表（响应式）
- `addCard(type, content)` — 添加卡片（自动定位到画布中央）
- `removeCard(id)` — 删除卡片
- `updateCardPosition(id, x, y)` — 更新位置
- `updateCardContent(id, content)` — 更新内容
- `selectedCardId` — 当前选中卡片
- `selectCard(id)` / `deselectAll()`

### useZoom.ts
- `scale` — 当前缩放比例
- `offsetX`, `offsetY` — 画布偏移量
- `zoomIn()` / `zoomOut()` / `resetZoom()`
- `handleWheel(event)` — 滚轮缩放
- `handlePan(event)` — 拖拽平移

## 8. 交互细节

### 拖拽
- 使用原生 `pointer events`（`pointerdown` / `pointermove` / `pointerup`）
- 拖拽时卡片跟随鼠标，松开后更新位置
- 卡片 z-index 自动提升（拖拽中的卡片在最前）

### 画布操作
- 滚轮缩放（以鼠标位置为中心）
- 右键/中键拖拽平移画布
- 双击画布空白处添加文字卡片（快速）

### 导出
- 使用 `html-to-image` 库（或原生 `canvas` 方案）将画布区域导出为 PNG

## 9. 文件结构

```
moodweave/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── types/
│   │   └── index.ts            ← 数据模型类型定义
│   ├── composables/
│   │   ├── useBoard.ts
│   │   ├── useCanvas.ts
│   │   └── useZoom.ts
│   ├── components/
│   │   ├── TopToolbar.vue
│   │   ├── MainLayout.vue
│   │   ├── Sidebar.vue
│   │   ├── BoardManager.vue
│   │   ├── AssetLibrary.vue
│   │   ├── CanvasArea.vue
│   │   ├── CanvasBoard.vue
│   │   ├── ImageCard.vue
│   │   ├── TextCard.vue
│   │   └── EditModal.vue
│   └── styles/
│       └── variables.css       ← CSS 变量（颜色、阴影、圆角等）
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-28-moodweave-design.md
├── .gitignore
└── README.md
```

## 10. 排除项（非 MVP，后续迭代）

- 用户登录 / 多设备同步
- 云端存储 / 数据库
- 拖拽排序素材库
- 撤销 / 重做（Undo/Redo）
- 图片滤镜 / 裁剪
- 多人协作
- 在线分享 Board 链接
- 移动端适配（先专注桌面端）

## 11. 成功标准

- 用户可以在 3 分钟内创建一个包含至少 3 张图片和 1 段文字的情绪板
- 导出 PNG 清晰可用
- 所有数据在页面刷新后不丢失
- 暗色视觉风格完整统一
- GitHub README 包含 GIF 演示和在线 Demo 链接
