# MoodWeave 开发进度

> 最后更新：2026-05-30

## 当前步骤：Step 10 — 润色 + README + 发布 GitHub
**状态：✅ 已完成**

### 已完成
- [x] Step 1：项目脚手架 + 暗色主题样式
- [x] Step 2：MainLayout + Sidebar 骨架（~30min）
- [x] Step 3：BoardManager — 项目管理（~45min）
- [x] Step 4：CanvasBoard — 画布 + 缩放平移（~45min）
- [x] Step 5：ImageCard + 添加图片（~45min）
- [x] Step 6：TextCard + 文字编辑（~45min）
- [x] Step 7：TopToolbar — 浮动工具栏（~30min）
- [x] Step 8：导出 PNG（~30min）
- [x] Step 9：AssetLibrary + 联动（~30min）
- [x] Step 10：润色 + README + 发布 GitHub（~45min）

### 待完成
- 暂无

### 最新更新
- 2026-05-30：[Agent-C] 新增文本与图片卡片之间的逻辑连线。Board 数据新增 `connections`，旧数据自动兼容为空数组；工具栏新增 `Connect` 按钮，选中卡片后进入 Pick target 模式，再点击另一种类型卡片即可创建连线；画布新增 SVG 连线层，卡片拖动时连线随坐标更新；删除卡片会同步清理相关连线；PNG 导出已绘制连线。Chrome DevTools MCP 已验证连接流程、持久化和导出 PNG。
- 2026-05-29：[Agent-C] 今日收工。完成存储架构迁移与回归验证，当前工作区已清理；下一次继续时可直接从 IndexedDB 图片存储方案基础上推进新功能或进一步优化兼容迁移。
- 2026-05-29：[Agent-C] 完成下一轮存储架构优化。新增 `useImageStore`，将本地上传图片保存到 IndexedDB，Board / Asset 中只保留 `mw-image://...` 轻量引用；`ImageCard`、`AssetLibrary` 和 PNG 导出均已接入引用解析；旧版 `data:image/...` 图片会在加载时后台迁移到 IndexedDB。Chrome DevTools MCP 已验证 IndexedDB 图片可正常渲染，localStorage 只保存短引用，PNG 导出可解析 IndexedDB 图片。
- 2026-05-29：[Agent-C] 修复 localStorage 配额超限引发的未处理异常。`useBoard` 和 `useAssets` 的持久化写入现在会捕获 `QuotaExceededError` 并在界面展示可读提示，不再让 Vue watcher 直接崩溃；本地上传图片改为先压缩为较小的 WebP data URL，降低触发配额上限的概率。已用 Chrome DevTools MCP 验证在受控配额超限场景下只出现可控 warning，不再出现 `Uncaught (in promise)`。
- 2026-05-29：[Agent-C] 使用 Chrome DevTools MCP 完成浏览器实测调试。确认 AddImage 弹层在桌面视口正常；在窄视口发现顶部工具栏单行溢出、弹层与换行工具栏重叠的问题，已将 `TopToolbar` 改为可换行并受父容器宽度约束，同时让 AddImage 弹层按按钮底部和整个工具栏底部的较大值定位；补齐 Board 与图片表单字段的 `id/name`，消除浏览器表单 issue。实测 Add image URL、素材保存与素材插回流程正常。
- 2026-05-29：[Agent-C] 修复 AddImage 弹层边距问题。`AddImageBtn` 改为通过 `Teleport` 渲染到 `body`，使用 fixed 定位并按视口 16px 安全边距夹紧位置，避免弹层受顶部工具栏定位、父容器或画布层级影响；补充 `aria-expanded`、`aria-haspopup` 与 Esc 关闭。
- 2026-05-29：[Agent-C] Step 10 完成。完成界面润色：侧栏改为 Boards / Assets 分段切换，素材库增加图片预览失败兜底，长 Board 名称改为省略显示，顶部状态移除开发步骤文案，空画布提示仅在无卡片时显示；同步更新 `README.md`，覆盖当前功能、脚本、存储与 PNG 导出注意事项。
- 2026-05-29：[Agent-C] Step 9 完成。新增 `useAssets` 和 `AssetLibrary`，支持将当前选中的图片或文本卡片保存到本地素材库，并从素材库一键插回当前 Board；侧栏新增 Boards / Assets 面板切换。本次同时修复 `EditModal` 重复渲染问题，并将顶部状态文案更新到 Step 9。
- 2026-05-29：[Agent-C] Step 8 完成。新增 `useExport` 和 `ExportBtn`，通过原生 Canvas 将当前 Board 导出为 PNG；导出内容包含暗色背景、网格、图片卡片和文本卡片，支持本地上传图片，远程图片加载失败时会在导出图中显示占位提示。
- 2026-05-29：[Agent-C] Step 7 完成。新增 `TopToolbar` 和 `DeleteBtn`，将添加图片、添加文本、删除选中卡片整合为画布顶部浮动工具栏；扩展 `useCanvas` 的 `selectedCard` 与 `removeSelectedCard`，支持删除当前选中的图片或文本卡片。
- 2026-05-29：[Agent-C] Step 6 完成。新增 `AddTextBtn`、`TextCard`、`EditModal`，扩展 `useCanvas` 的文本编辑状态；画布现在可添加文本卡片、拖拽移动、双击编辑并保存到当前 Board。
- 2026-05-29：[Agent-C] 完成一次缺陷修复审查。修正 AddImage 弹层层级被画布遮挡的问题，调整画布顶部层级与弹层 z-index；修正 CanvasBoard 的卡片过滤和提示文案；补上切换 Board 时清理选中态，避免跨板残留。
- 2026-05-29：[Agent-C] 完善协作协议到 v2.1，新增交付范围判定、开工检查清单、审查风险说明与交接模板字段，避免将“最后改动是文档”误判为无需审查。
- 2026-05-29：[Agent-C] Step 5 完成。新增 `useCanvas`、`AddImageBtn`、`ImageCard`，支持本地上传或 URL 添加图片卡片，图片卡片可选中并在缩放画布中拖拽移动。本次交付同时修改了 `CanvasArea`、`CanvasBoard`、`useZoom`、`App.vue` 以及进度文件本身。
- 2026-05-29：[Agent-C] Step 4 完成。新增 `useZoom`、`CanvasArea`、`CanvasBoard`，右侧工作区支持滚轮缩放与中键/右键拖拽平移。
- 2026-05-29：[Agent-C] Step 3 完成。新增 `useBoard` 本地存储状态层和 `BoardManager` 面板，支持创建、切换、重命名、删除 Board，刷新后保留数据。
- 2026-05-29：[Agent-C] Step 2 完成。新增 MainLayout + Sidebar 双栏骨架，App.vue 切到工作区占位界面。
- 2026-05-28：[SOLO] 协作协议升级到 v2.0，自动化 git pull/push 流程，用户只需说“继续 MoodWeave”和“今天结束了”两句话。
- 2026-05-28：[SOLO] 设计文档迁移到项目内，清理工作目录，项目已推送到 GitHub 远程仓库。
- 2026-05-28：[SOLO] 建立多 AI 协作协议体系。创建 `docs/superpowers/AGENTS.md`、`HANDOFF.md`、`REVIEW.md`。
- 2026-05-28：[SOLO] Step 1 完成。Vue 3 + Vite + TS 脚手架 + 暗色霓虹主题 + Board/Card 类型定义 + App.vue 欢迎页。
- 2026-05-28：[SOLO] 项目定稿：MoodWeave 灵感情绪板，布局B(双栏) + 暗色霓虹主题。设计文档和分步计划完成。

## 2026-05-30 Agent-C update

- Added editable labels to image/text connections. Labels are stored on `Connection.label`, normalized for old boards, rendered on the canvas, persisted after reload, and drawn into PNG exports.
- Added local/private PackyCode-compatible AI image generation. `.env.example` reserves `VITE_PACKYCODE_BASE_URL`, `VITE_PACKYCODE_API_KEY`, `VITE_IMAGE_MODEL=gpt-image-2`, and `VITE_IMAGE_SIZE`.
- Added an `AI image` toolbar popover. Selected text cards can seed the prompt; missing API keys show a readable UI message without runtime errors.
- Tightened popover viewport bounds for Add image and AI image panels.
- Verification: `npm run build` passed; Chrome DevTools MCP verified connection label edit/persistence, missing-key generation handling, Add image panel behavior, PNG export click, and no new console errors.

## 2026-05-30 Agent-C PackyAPI config update

- Rechecked PackyAPI GPT-Image-2 docs at `https://docs.packyapi.com/docs/paint/GPTImage.html`.
- Updated image generation request config to match the Images API guidance: `/v1/images/generations`, Sora-token bearer auth, `n: 1`, `quality`, `response_format`, `output_format`, `background`, and `moderation`.
- Extended `.env.example` and README with PackyAPI-supported image parameters. MoodWeave keeps `response_format=b64_json` by default because it saves generated images into IndexedDB; users can switch to `url` if they prefer Packy download links.

## 2026-05-30 Agent-C canvas pan and connection style update

- Made the blank canvas directly draggable with left mouse/pointer drag while keeping card dragging behavior unchanged.
- Reworked connection visuals with type-aware color themes, a glow/shadow track, a crisp gradient line, source dots, and larger explicit target arrows so direction is easier to read.
- Synced the same connection direction styling into PNG export.
- Verification: `npm run build` passed; Chrome DevTools MCP verified canvas-stage transform changes after blank-canvas drag, connection SVG markers render, PNG export click works, and console has no runtime errors.

## 2026-05-30 Agent-C popover dismissal update

- Updated Add image and AI image popovers to close when focus or pointer interaction moves outside the button/panel instead of requiring a second click on the same toolbar button.
- Verification: `npm run build` passed; Chrome DevTools MCP verified outside-click dismissal, focus-out dismissal, and no runtime console errors.

## 2026-05-30 Agent-C connection refinement update

- Simplified connection styling to a thinner, clearer diagram style: 2.25px main line, subtle 4.75px backing stroke, smaller source dots, and smaller bordered target arrows.
- Moved connection anchors from card centers to card-edge points with a small outside gap so source dots and target arrows are not hidden underneath image/text cards.
- Synced the same edge-anchor and lighter-line logic into PNG export.
- Verification: `npm run build` passed; Chrome DevTools MCP verified arrow/dot bounding boxes do not overlap card bounds, PNG export click works, and console has no runtime errors.

## 2026-05-30 Agent-C one-click startup update

- Added a Windows-friendly `start.bat` plus `scripts/start.ps1` to check Node/npm, install dependencies when `node_modules` is missing, and start the dev server.
- Added `scripts/start.sh` for macOS/Linux users and documented the same startup flow in README.
- Added `npm start` as the canonical local start command backed by `vite --host 127.0.0.1 --port 5173`.
- Expanded README with Node.js version requirements, one-click startup instructions, manual startup instructions, AI config notes, and common troubleshooting steps.
- Verification: `powershell -ExecutionPolicy Bypass -File scripts/start.ps1 -CheckOnly` passed; `npm run build` passed. The current Windows environment does not provide `sh`, so the shell script was not executable in this session.

## 2026-05-30 Agent-C startup browser auto-open update

- Updated `npm start` to run Vite with `--open`, so `start.bat`, `scripts/start.ps1`, `scripts/start.sh`, and manual `npm start` all open the browser automatically after the dev server starts.
- Updated startup script messages and README to explain the automatic browser open behavior plus the fallback URL.
- Verification: `powershell -ExecutionPolicy Bypass -File scripts/start.ps1 -CheckOnly` passed; `npm run build` passed.
