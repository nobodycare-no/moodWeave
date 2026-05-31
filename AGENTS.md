# MoodWeave 智能体上线须知

> 完整协作协议请阅 `docs/superpowers/AGENTS.md`

## 一句话启动

| 你说 | AI 自动做 |
|------|----------|
| **"继续 MoodWeave"** | `git switch 自己分支` -> `git pull` -> 识别身份 -> 审查(如需) -> 读进度 -> 开发 |
| **"今天结束了"** | 更新 `status.md` -> commit -> `git push` |

## 分支规则

- **Agent-C（公司）** → `main` 分支
- **SOLO（Home）** → `solo-*` 分支（当前：`solo-iteration-2`）
- **合并**：你说的"合并分支"时，通过 PR 将 SOLO 分支合并到 main

## 你的身份

- **在家 →** SOLO，用 `SOLO <solo@moodweave.dev>`，开发 `solo-*` 分支
- **在公司 →** Agent-C，用 `Agent-C <agent-c@moodweave.dev>`，开发 `main` 分支
