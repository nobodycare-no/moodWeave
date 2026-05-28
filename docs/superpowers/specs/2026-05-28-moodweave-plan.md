# MoodWeave — MVP 实施计划

> 基于设计文档：2026-05-28-moodweave-design.md
> 预计总工时：约 6-8 小时（碎片化时间，可分 8-10 次完成）

## 实施策略

- 每个步骤为独立可验证的小单元，30-60 分钟可完成
- 每步结束时项目处于**可运行状态**
- 每步完成后建议 commit 一次
- 步骤按依赖关系排列，必须顺序执行

---

## Step 1：项目脚手架 + 全局样式（~30min）

**目标**：初始化 Vue 3 + Vite + TypeScript 项目，搭建暗色主题 CSS 变量体系

```
moodweave/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── src/
│   ├── main.ts
│   ├── App.vue              ← 纯黑背景 + 「MoodWeave」标题占位
│   ├── styles/
│   │   └── variables.css    ← 暗色主题 CSS 变量
│   └── types/
│       └── index.ts         ← Board / Card 类型定义
├── .gitignore
└── README.md                ← 项目简介 + 如何运行
```

**验证**：`npm run dev` 启动，浏览器看到暗色页面

---

## Step 2：MainLayout + Sidebar 骨架（~30min）

**目标**：搭建双栏布局，左侧边栏 + 右侧占位

- `MainLayout.vue` — flex 双栏容器
- `Sidebar.vue` — 固定宽度（260px）侧边栏骨架

**验证**：浏览器看到左右两栏布局

---

## Step 3：BoardManager — 项目管理（~45min）

**目标**：实现多 Board 的创建、切换、删除、重命名

- `composables/useBoard.ts` — localStorage 的 CRUD 逻辑
- `BoardManager.vue` — Board 列表 UI

**验证**：可以创建 2-3 个 Board，切换时看到选中状态变化，刷新页面后数据保留

---

## Step 4：CanvasBoard — 画布容器 + 缩放/平移（~45min）

**目标**：实现可以缩放和平移的画布

- `composables/useZoom.ts` — scale/offset 逻辑
- `CanvasBoard.vue` — 画布容器（transform: scale + translate）
- `CanvasArea.vue` — 右侧画布区域包装器

**验证**：滚轮缩放、拖拽平移画布，画布上有网格背景更好

---

## Step 5：ImageCard + 添加图片（~45min）

**目标**：实现图片卡片 + 图片上传/URL 输入

- `composables/useCanvas.ts` — 卡片增删改逻辑
- `ImageCard.vue` — 可拖拽的图片卡片（带选中高亮）
- `AddImageBtn.vue` — 支持本地上传和 URL 粘贴

**验证**：可以从本地上传图片或输入 URL，卡片出现在画布上，可拖拽移动

---

## Step 6：TextCard + 文字编辑弹窗（~45min）

**目标**：实现文字卡片 + 编辑功能

- `TextCard.vue` — 可拖拽、可双击编辑的文字卡片
- `EditModal.vue` — 文字内容编辑弹窗

**验证**：添加文字卡片，双击编辑内容，拖拽移动，删除

---

## Step 7：TopToolbar — 浮动工具栏（~30min）

**目标**：将所有操作集成到浮动工具栏

- `TopToolbar.vue` — 浮动在画布顶部的操作栏
- `DeleteBtn.vue` — 删除选中卡片
- 整合 AddImageBtn、AddTextBtn

**验证**：工具栏显示在画布顶部，所有按钮功能正常

---

## Step 8：导出 PNG（~30min）

**目标**：将画布内容导出为图片

- `ExportBtn.vue` — 使用 `html-to-image` 库导出 PNG
- 自动下载到本地

**验证**：点击导出，下载的 PNG 包含画布上所有卡片

---

## Step 9：AssetLibrary + 联动（~30min）

**目标**：侧边栏显示素材缩略图列表，点击定位到画布上对应卡片

- `AssetLibrary.vue` — 显示当前 Board 所有卡片的缩略图列表
- 点击缩略图，画布自动滚动到对应卡片位置并高亮

**验证**：侧边栏显示所有卡片的缩略图，点击后画布定位到对应卡片

---

## Step 10：润色 + README + 发布（~45min）

**目标**：项目抛光，写完 README，准备 GitHub 发布

- 交互细节打磨（过渡动画、选中态样式）
- 错误处理（图片加载失败的回退显示等）
- README.md：项目描述、截图/GIF、Demo 链接、快速开始
- 初始化 Git 仓库，推送到 GitHub

**验证**：GitHub 仓库可见，README 美观，其他人可 clone 运行

---

## 总览

| 步骤 | 内容 | 预估时长 | 可独立验证 |
|------|------|---------|-----------|
| 1 | 脚手架 + 样式 | 30min | ✅ 暗色页面 |
| 2 | 双栏布局骨架 | 30min | ✅ 左右两栏 |
| 3 | Board 管理 | 45min | ✅ CRUD + 持久化 |
| 4 | 画布缩放/平移 | 45min | ✅ 交互操作 |
| 5 | 图片卡片 | 45min | ✅ 添加/拖拽 |
| 6 | 文字卡片 | 45min | ✅ 添加/编辑 |
| 7 | 浮动工具栏 | 30min | ✅ 工具栏操作 |
| 8 | 导出 PNG | 30min | ✅ 下载图片 |
| 9 | 素材库联调 | 30min | ✅ 缩略图定位 |
| 10 | 润色 + 发布 | 45min | ✅ GitHub 上线 |

**注**：每步的估算是纯编码时间，不包含学习和调试。作为参考，如果你每天有 30-60 分钟碎片时间，大约 2 周内可以完成 MVP。

---

## 开始方式

从 Step 1 开始，我会帮你：
1. 创建所有必要的文件和代码
2. 安装依赖
3. 验证运行结果
4. 指导你 commit

**准备好了就直接告诉我开始 Step 1 吧！** 🚀
