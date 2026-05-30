# MoodWeave

MoodWeave 是一个轻量的本地灵感情绪板工作台，用于在自由画布上收集视觉参考、文字片段和可复用素材。

## 功能

- 多 Board 管理：创建、切换、重命名、删除不同灵感项目
- 自由画布：支持缩放、平移、选中卡片和拖拽移动
- 图片卡片：支持本地上传图片，也支持通过图片 URL 添加
- 文本卡片：支持添加文本卡片，并通过双击编辑内容
- 逻辑连线：选中图片或文本卡片后可连接另一张卡片，支持连线标签和清晰的方向箭头
- AI 生图：可根据文本提示词生成图片，默认预留 PackyAPI / `gpt-image-2` 配置
- 素材库：可将当前选中的图片或文本卡片保存为素材，并插回任意当前 Board
- PNG 导出：导出当前 Board，包含暗色背景、网格、图片卡片、文本卡片和连线
- 本地存储：Board 元数据保存在 localStorage，本地上传图片保存在 IndexedDB，无需后端服务

## 环境要求

MoodWeave 使用 Vite 8，需要：

- Node.js `20.19+` 或 `22.12+`
- npm，随 Node.js 官方安装包一起安装

如果电脑还没有 Node.js，请先访问 https://nodejs.org/ 安装 LTS 版本。安装后重新打开终端，再运行：

```bash
node -v
npm -v
```

## 快速开始

### 一键启动

Windows 用户可以直接双击根目录的：

```text
start.bat
```

这个脚本会自动检查 Node.js / npm，缺少依赖时执行 `npm install`，然后启动开发服务器。启动成功后浏览器打开：

```text
http://localhost:5173
```

启动后会自动打开默认浏览器；如果系统拦截了自动打开，再手动访问上面的地址。

macOS / Linux 用户可以运行：

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

PowerShell 用户也可以运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/start.ps1
```

### 手动启动

```bash
npm install
npm start
```

启动后会自动打开默认浏览器；如果系统拦截了自动打开，再手动访问 `http://localhost:5173`。

## 常用脚本

```bash
npm start
npm run dev
npm run build
npm run preview
```

- `npm start`：以固定地址 `localhost:5173` 启动本地开发服务器，并自动打开浏览器。
- `npm run dev`：使用 Vite 默认开发模式启动。
- `npm run build`：执行 TypeScript 检查并生成生产构建。
- `npm run preview`：预览生产构建结果。

如果你更习惯手动启动，也可以直接运行 `npm start`，它和一键脚本使用同一条入口命令。

## 注意事项

- Board、卡片坐标、文本和素材库元数据都存储在浏览器本地。
- 本地存储是按站点来源隔离的，`localhost:5173` 和 `127.0.0.1:5173` 是两份不同的数据。如果你之前在一个地址保存过画板，请始终用同一个地址打开项目。
- 本地上传图片会压缩后保存到 IndexedDB，Board 中只保存轻量图片引用，避免大图撑爆 localStorage。
- 旧版本遗留的 data URL 图片会在加载时后台迁移到 IndexedDB。
- 远程图片 URL 可能因为 CORS 限制无法写入导出画布；遇到这种情况时，MoodWeave 会继续导出，并在 PNG 中绘制图片占位。
- AI 生图需要你自己配置 API key；没有 key 时其他功能仍可正常使用。

## 技术栈

- Vue 3 + Composition API + `<script setup>`
- TypeScript
- Vite
- localStorage
- IndexedDB

## 许可

MIT

## AI 生图配置

MoodWeave 包含一个本地/私人使用的 AI 生图入口，会从浏览器直接调用 PackyAPI / OpenAI-compatible Images API。复制 `.env.example` 为 `.env`，然后填入你自己的 API key：

```bash
VITE_PACKYCODE_BASE_URL=https://www.packyapi.com/v1
VITE_PACKYCODE_API_KEY=your_key_here
VITE_IMAGE_MODEL=gpt-image-2
VITE_IMAGE_SIZE=1024x1024
VITE_IMAGE_QUALITY=auto
VITE_IMAGE_RESPONSE_FORMAT=b64_json
VITE_IMAGE_OUTPUT_FORMAT=png
VITE_IMAGE_BACKGROUND=opaque
VITE_IMAGE_MODERATION=auto
```

默认模型是 `gpt-image-2`。PackyAPI 要求这个模型使用 Sora 分组令牌。MoodWeave 使用 PackyAPI 推荐的 Images API：`POST /v1/images/generations`，并固定 `n: 1`。

生成的 base64 图片会保存到 IndexedDB，并通过轻量的 `mw-image://...` 引用写入 Board。如果你把 `VITE_IMAGE_RESPONSE_FORMAT` 改为 `url`，MoodWeave 会尝试把返回的图片链接转存到本地 IndexedDB；如果浏览器因为 CORS 或网络限制无法读取图片，则回退为直接保存 URL。

PackyAPI 说明 `response_format=url` 更适合手动保存，`b64_json` 更适合程序自行保存图片。MoodWeave 默认使用 `b64_json`，因为它会自动把生成图片放进本地图片库。`output_format` 推荐使用 `png` 或 `jpeg`，默认配置不暴露 `webp`。

注意：Vite 的 `VITE_*` 环境变量会暴露到浏览器代码中，所以这套配置只适合本地/私人使用。如果要给多人或生产环境使用，应该把 PackyAPI key 放到后端代理中，前端只调用自己的代理接口。

## 常见问题

### 双击 `start.bat` 后提示没有 Node.js

先安装 Node.js LTS：https://nodejs.org/  
安装完成后关闭旧终端或资源管理器窗口，再重新打开项目目录运行脚本。

### `npm install` 很慢或失败

这通常是网络或 npm registry 访问问题。可以换网络后重试，或者配置你常用的 npm 镜像源。

### 端口 `5173` 被占用

先关闭之前启动的 MoodWeave/Vite 终端窗口，然后重新运行启动脚本。也可以手动运行：

```bash
npm run dev -- --host localhost --port 5174
```

### 重启后之前的画板看起来不见了

MoodWeave 的数据保存在浏览器本地，不会因为关闭开发服务器而删除。但浏览器会按完整站点来源隔离数据，所以这些地址互相看不到对方的数据：

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:5174`

一键启动脚本固定使用 `http://localhost:5173`。如果你之前在 `127.0.0.1:5173` 保存过画板，可以临时运行下面的命令打开旧地址查看：

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --open
```

之后建议始终使用一键启动脚本或 `npm start`，保持同一个地址，画板就会持续保存在本地浏览器中。

### AI 生图按钮提示缺少 API key

复制 `.env.example` 为 `.env`，填入 `VITE_PACKYCODE_API_KEY` 后重启开发服务器。注意必须使用 PackyAPI 的 Sora 分组令牌。

## 产品思路

- 连接线标签可以表达关系意图，例如 `style cue`、`contrast`、`supports`、`variation`、`reference`。
- 选中文本卡后打开 AI image，会自动用文本卡内容作为提示词草稿。
- 后续可以把相连文本卡和连接线标签组合成更完整的提示词，例如：图片卡 + `variation` 连线 + 文本卡 -> 生成有方向的视觉变体。
- AI 生成的图片卡后续可以记录 prompt/model 元数据，支持重新生成、对比和追溯视觉决策。
