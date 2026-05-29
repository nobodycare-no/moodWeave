# MoodWeave 智能体上线须知

> 完整协作协议请阅 `docs/superpowers/AGENTS.md`

## 一句话启动

| 你说 | AI 自动做 |
|------|----------|
| **"继续 MoodWeave"** | `git pull` -> 识别身份 -> 开工检查 -> 审查(如需) -> 读进度 -> 开发 |
| **"今天结束了"** | 更新 `status.md` -> 如需更新 `HANDOFF.md` -> commit -> `git push` |

全程你只需要说这两句话，拉取/推送全自动。

## 你的身份

- **在家 ->** SOLO，用 `SOLO <solo@moodweave.dev>`
- **在公司 ->** Agent-C，用 `Agent-C <agent-c@moodweave.dev>`

## 开工检查清单

在每次接手前，必须先确认下面几项：

1. 远端已同步：`git pull` 成功。
2. 最近交付已识别：看 `git log --oneline -3`。
3. 交付范围已判断：最近一次提交是否包含代码、配置、状态文件或交接文件。
4. 审查是否需要：如果最近一次完整交付来自对方，就必须审查。
5. 进度文件已读取：`docs/superpowers/status.md`、`HANDOFF.md`、`REVIEW.md`。

## 容易误判的情况

- 如果最近一次提交最后改的是文档，但同一提交里也改了代码，仍然要按代码交付审查。
- 如果 `status.md` 写了“完成”，不代表代码就一定完整，仍需核对对应实现和构建。
- 如果 `HANDOFF.md` 为空，只能说明没有明确交接事项，不能替代审查。
- 如果 `git pull` 失败，必须先说明未同步远端，再继续下一步。

