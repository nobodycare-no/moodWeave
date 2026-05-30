# MoodWeave

MoodWeave 是一个轻量的本地灵感情绪板工作台，用于在自由画布上收集视觉参考、文字片段和可复用素材。

## 功能

- 多 Board 管理：创建、切换、重命名、删除不同灵感项目
- 自由画布：支持缩放、平移、选中卡片和拖拽移动
- 图片卡片：支持本地上传图片，也支持通过图片 URL 添加
- 文本卡片：支持添加文本卡片，并通过双击编辑内容
- 逻辑连线：选中图片或文本卡片后可连接另一种类型的卡片，让灵感关系更清晰
- 素材库：可将当前选中的图片或文本卡片保存为素材，并插回任意当前 Board
- PNG 导出：导出当前 Board，包含暗色背景、网格、图片卡片、文本卡片和连线
- 本地存储：Board 元数据保存在 localStorage，本地上传图片保存在 IndexedDB，无需后端服务

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

- Board、卡片坐标、文本和素材库元数据都存储在浏览器本地。
- 本地上传图片会压缩后保存到 IndexedDB，Board 中只保存轻量图片引用，避免大图撑爆 localStorage。
- 旧版本遗留的 data URL 图片会在加载时后台迁移到 IndexedDB。
- 远程图片 URL 可能因为 CORS 限制无法写入导出画布；遇到这种情况时，MoodWeave 会继续导出，并在 PNG 中绘制图片占位。

## 技术栈

- Vue 3 + Composition API + `<script setup>`
- TypeScript
- Vite
- localStorage
- IndexedDB

## 许可

MIT

## AI image generation

MoodWeave includes a local/private AI image generation entry that calls a PackyCode/OpenAI-compatible image generation endpoint from the browser. Copy `.env.example` to `.env`, then fill in your own key:

```bash
VITE_PACKYCODE_BASE_URL=https://www.packyapi.com/v1
VITE_PACKYCODE_API_KEY=your_key_here
VITE_IMAGE_MODEL=gpt-image-2
VITE_IMAGE_SIZE=1024x1024
```

The default model is `gpt-image-2`. Generated base64 images are stored in IndexedDB through the same lightweight `mw-image://...` reference flow used by uploaded images. If the proxy returns only a remote image URL, MoodWeave will try to store the blob locally and fall back to the URL if the browser blocks the fetch.

Because Vite `VITE_*` variables are exposed to browser code, this configuration is only appropriate for local/private usage. For shared or production usage, place the PackyCode key behind a backend proxy and let the frontend call that proxy instead.

## Product notes

- Connection labels can express relationship intent such as `style cue`, `contrast`, `supports`, `variation`, or `reference`.
- A selected text card seeds the AI image prompt, so text nodes can act as reusable prompt fragments.
- A later iteration could combine connected text cards and connection labels into richer prompts, for example: image card + `variation` line + text card -> generate a directed visual variation.
- Generated image cards could later store prompt/model metadata so users can regenerate, compare, or audit visual decisions.
