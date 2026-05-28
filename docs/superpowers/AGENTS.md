# MoodWeave — AI Agent 多智能体协作协议

> 版本：v1.0
> 本文件是 AI 与 AI 之间协作的核心规范。**任何 AI 开始工作前必须先读本文件。**

---

## 1. 🆔 智能体身份识别

每个 AI 使用不同的 Git 身份提交代码，通过 commit 历史自动识别谁做了什么事。

| 身份 | Git Author | 识别方式 | 场景 |
|------|-----------|---------|------|
| **SOLO** | `SOLO <solo@moodweave.dev>` | Home 电脑 AI | 在家开发 |
| **Agent-C** | `Agent-C <agent-c@moodweave.dev>` | 公司电脑 AI | 在公司开发 |

## 2. 🔄 开工协议

**用户只说一句话（如"继续 MoodWeave"），你的工作流程：**

```
Step 1: 读 AGENTS.md（本文件）→ 了解协作规范
Step 2: 读 docs/superpowers/status.md → 了解当前进度
Step 3: 看 git log --oneline -5 → 识别最后是谁提交的，做了什么
Step 4: 检查 docs/superpowers/REVIEW.md → 看上次是否有代码审查意见
Step 5: 读 HANDOFF.md → 看上次有没有交接留言
Step 6: 开始干活！
```

## 3. 📝 代码审查协议

**每次接手项目时，必须先审查上一次对方提交的代码。** 不是在交接时审查，而是在**每次开始工作前审查上一次的提交**。

### 审查流程

```bash
# 1. 查看对方上次提交了什么
git log --oneline -3 --author="Agent-C"   # 我(SOLO)查 Agent-C 最近提交
git log --oneline -3 --author="SOLO"      # Agent-C 查 SOLO 最近提交

# 2. 查看具体改动
git show <commit-hash> --stat            # 看改了哪些文件
git show <commit-hash>                   # 看完整 diff

# 3. 如果连续多天都是同一位 AI 开发
#    只审查对方最后那次交接时的提交，中间连续的同一位 AI 提交可以跳过
```

### 审查要点
- 代码风格是否符合 AGENTS.md 中定义的规范
- 功能是否按 status.md 的规划实现
- 是否有明显 bug 或可优化的地方

### 审查结果记录
写入 `docs/superpowers/REVIEW.md`

## 4. 📨 交接协议 (HANDOFF)

**每次开发结束后必须做的事：**

### 4.1 更新 status.md
- 标记完成/未完成的项目
- 在"最新更新"区写清楚本次做了什么

### 4.2 写 HANDOFF.md（如有需要）
如果当前步骤做到一半没做完，或有特别需要对方注意的事项，写在 `HANDOFF.md`。

### 4.3 Git commit 规范
```bash
# 提交格式：<身份标识> <类型>: <描述>
# 示例：
git commit -m "[SOLO] feat: 完成画布缩放和平移功能"
git commit -m "[Agent-C] fix: 修复图片上传后位置偏移问题"
git commit -m "[SOLO] review: 审查 Agent-C 的 BoardManager 代码"
```

## 5. 🔧 场景工作流

### 场景 A：你(HOME) → 我(SOLO) 继续开发
你说："继续 MoodWeave"
```
我做的事：
1. git log --oneline -5 → 看到最后是 Agent-C 提交的
2. git show [Agent-C 最后的 commit hash] → 审查代码
3. 如果有问题 → 写 REVIEW.md
4. 读 status.md → 知道从哪继续
5. 开始编码
6. 结束 → 更新 status.md + HANDOFF.md(可选) + commit
```

### 场景 B：你在公司 → Agent-C 继续开发（连续多天）
你说："继续 MoodWeave"
```
Agent-C 做的事：
1. git log --oneline -5 → 看到最后是我(SOLO)或自己(Agent-C)提交的
2. 如果最后是 SOLO 提交 → git show [SOLO的commit] → 审查
3. 如果最后是自己(Agent-C)提交 → 跳过审查（连续同人开发）
4. 读 status.md → 知道从哪继续
5. 开始编码
6. 结束 → 更新 status.md + commit
```

### 场景 C：你在公司 → Agent-C → 第二天继续在公司
你说："继续 MoodWeave"
```
Agent-C 做的事：
1. git log --oneline -3 → 看到最后是自己(Agent-C)提交的
2. 跳过审查（连续同人不需要审查自己）
3. 读 status.md → 知道从哪继续
4. 直接开干
```

## 6. 📋 每日结束检查清单

开发结束时，请确保做了以下的事：

- [ ] `docs/superpowers/status.md` 已更新（完成项、最新进展）
- [ ] 如果有未完成的工作或注意事项 → `HANDOFF.md` 已更新
- [ ] `git add .` 添加了所有改动
- [ ] `git commit -m "[身份] 类型: 描述"` 提交信息规范
- [ ] 告诉用户 "今天完成了 XX，下次继续时请说「继续 MoodWeave」"

## 7. ⚠️ 冲突处理

如果 pull 时发生冲突：
1. 不要惊慌，这是正常的
2. 手动解决冲突（通常是 status.md 或 HANDOFF.md）
3. 保留双方信息，不要覆盖对方的"最新更新"记录
4. 解决后 commit: `git commit -m "[身份] merge: 解决冲突"`
