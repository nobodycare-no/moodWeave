# MoodWeave

MoodWeave 是一个轻量的本地灵感情绪板工作台，用于在自由画布上收集视觉参考、文字片段和可复用素材。

## 功能

- 多 Board 管理：创建、切换、重命名、删除不同灵感项目
- 自由画布：支持缩放、平移、选中卡片和拖拽移动
- 图片卡片：支持本地上传图片，也支持通过图片 URL 添加
- 文本卡片：支持添加文本卡片，并通过双击编辑内容
- 素材库：可将当前选中的图片或文本卡片保存为素材，并插回任意当前 Board
- PNG 导出：导出当前 Board，包含暗色背景、网格、图片卡片和文本卡片
- 本地存储：数据保存在浏览器 localStorage，无需后端服务

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

## 常用脚本

```bash
npm run dev
npm run build
npm run preview
```

## 注意事项

- Board 和素材库数据都存储在浏览器本地。
- 本地上传图片会以 data URL 形式保存，通常可以稳定导出 PNG。
- 远程图片 URL 可能因为 CORS 限制无法写入导出画布；遇到这种情况时，MoodWeave 会继续导出，并在 PNG 中绘制图片占位。

## 技术栈

- Vue 3 + Composition API + `<script setup>`
- TypeScript
- Vite
- localStorage

## 许可

MIT
