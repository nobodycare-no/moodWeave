# MoodWeave — AI Agent 多智能体协作协议

> 版本：v2.0
> 本文件是 AI 与 AI 之间协作的核心规范。**任何 AI 开始工作前必须先读本文件。**

---

## 1. 🆔 智能体身份识别

每个 AI 通过 Git 身份标识自己，commit 历史就是身份名片。

| 身份 | Git Author | 场景 |
|------|-----------|------|
| **SOLO** (我) | `SOLO <solo@moodweave.dev>` | Home 电脑 |
| **Agent-C** | `Agent-C <agent-c@moodweave.dev>` | 公司电脑 |

## 2. 🔄 核心工作流

```
        用户说"继续 MoodWeave"
                │
                ▼
    ┌───────────────────────┐
    │  ① git pull (拉取最新)  │ ← 始终先拉取，确保拿到对方最新代码
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  ② 身份识别            │ ← git log --oneline -3，看最后是谁提交的
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  ③ 交叉审查            │ ← 如果对方最后提交，审查代码；自己则跳过
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  ④ 读进度文件           │ ← status.md + HANDOFF.md + REVIEW.md
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  ⑤ 开发                │ ← 编码！
    └───────────┬───────────┘
                │
        用户说"今天结束了"
                │
                ▼
    ┌───────────────────────┐
    │  ⑥ 收尾 + push         │ ← 更新 status.md + commit + git push
    └───────────────────────┘
```

## 3. 开工协议 —— 用户说"继续 MoodWeave"

**用户在任意时刻说这句话，你就按以下流程执行：**

### Step 1: git pull（必须！）

```bash
git pull
```
- **目的**：拿到对方可能已经推送的最新代码
- 如果是 "Already up to date" → 正常继续
- 如果有冲突 → 见第 7 节冲突处理

### Step 2: 身份识别

```bash
git log --oneline -3
```

查看 commit 消息开头的 `[SOLO]` 或 `[Agent-C]` 标识，判断：
- 最后一个提交是谁做的？
- 是不是连续多天都是自己？

### Step 3: 交叉审查

| 情况 | 行为 |
|------|------|
| 上次是**对方**提交的 | 审查对方代码 → 结果写入 `REVIEW.md` |
| 上次是**自己**提交的 | 跳过审查（连续同人开发不需要审查自己） |
| 上次是**自己**但中间有对方的提交 | 审查对方那次的提交 |

审查命令：
```bash
git show <commit-hash> --stat   # 看改了哪些文件
git show <commit-hash>          # 看完整 diff
```

审查要点：
- 代码风格是否符合规范？
- 功能是否按 `status.md` 的规划实现的？
- 是否有明显 bug 或可优化的地方？

### Step 4: 读进度文件

- `docs/superpowers/status.md` — 当前做到哪一步
- `docs/superpowers/HANDOFF.md` — 对方是否有留言
- `docs/superpowers/REVIEW.md` — 上次审查是否有待处理意见

### Step 5: 开始开发

开工！coding time 💻

## 4. 收尾协议 —— 用户说"今天结束了"

**用户说这句话时，你立即执行以下流程：**

### Step 1: 更新 status.md

```markdown
### 最新更新
- [今天日期] [SOLO/Agent-C] 完成了 XX 功能，...
```

更新完成后打勾。

### Step 2: 写 HANDOFF.md（如果需要）

如果当前步骤**没做完**，或有**注意事项**要告诉对方，写在这里。

**如果步骤做完了且没有特别要说的，HANDOFF.md 保持空文件即可。**

### Step 3: git commit

```bash
git add .
git commit -m "[身份] 类型: 描述"
```

commit 消息格式：
```
[SOLO] feat: 完成画布缩放和平移功能
[Agent-C] fix: 修复图片上传后位置偏移问题
[SOLO] review: 审查 Agent-C 的 BoardManager 代码
[Agent-C] merge: 解决 pull 冲突
```

若没有任何改动 → 跳过 commit，告诉用户"今天没有代码变更"。

### Step 4: git push

```bash
git push
```

- push 成功 → 告诉用户"已推送，代码已同步"
- push 失败（认证/网络问题）→ 告诉用户手动执行 `git push`

### Step 5: 告知用户

> "今天完成了 XX。下次开发时说「继续 MoodWeave」即可。"

## 5. ⚠️ 冲突处理

`git pull` 时如果发生冲突：

1. **别慌**，冲突通常只出现在 `status.md` 或 `HANDOFF.md` 这种双方都可能改的文件
2. 查看冲突文件，**保留双方的信息**，不要删掉对方的"最新更新"记录
3. 解决后：
   ```bash
   git add .
   git commit -m "[身份] merge: 解决冲突"
   git push
   ```

## 6. 🎯 用户完全不操心的自动化

| 用户行为 | 你自动做的事 |
|---------|------------|
| "继续 MoodWeave" | `git pull` → 识别身份 → 审查(如需) → 读进度 → 开发 |
| "今天结束了" | 更新 status.md → commit → `git push` |
| （用户什么都没说，你正在开发中） | 只做开发，不碰任何 Git 操作 |
| pull 时发现冲突 | 自动解决 → commit merge → push |

## 7. 📋 快速参考

### 开工（用户说"继续 MoodWeave"）

```
1. git pull
2. git log --oneline -3           → 谁最后提交？
3. 如果是对方 → git show <hash>  → 审查
4. 读 status.md + HANDOFF.md + REVIEW.md
5. 开发
```

### 收工（用户说"今天结束了"）

```
1. 更新 docs/superpowers/status.md
2. 如有需要 → 更新 HANDOFF.md
3. git add . && git commit -m "[身份] 类型: 描述"
4. git push
5. 告诉用户：今天完成了 XX
```
