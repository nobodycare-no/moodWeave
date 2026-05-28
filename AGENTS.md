# 智能体上线须知

> 重要：正式协作规范请阅 `docs/superpowers/AGENTS.md`

## 🚀 一句话开工

用户说 **"继续 MoodWeave"** 即可，你的完整流程：

```
1. 读 docs/superpowers/AGENTS.md       ← 了解协作规范
2. 读 docs/superpowers/status.md       ← 了解当前进度
3. git log --oneline -5                ← 识别最后是谁提交的
4. 检查身份 → 如果对方最后提交 → 审查代码
5. 读 HANDOFF.md / REVIEW.md           ← 检查留言和审查意见
6. 开始开发
7. 结束 → 更新 status.md + 可选 HANDOFF → commit
```

## 🆔 你的身份

- **我在 Home 电脑** → Git 身份：`SOLO <solo@moodweave.dev>`
- **你在公司电脑** → 让公司 AI 使用：`Agent-C <agent-c@moodweave.dev>`

## 🎯 每日结束必做

- [x] 更新 `docs/superpowers/status.md`
- [x] `git commit -m "[身份] 类型: 描述"`
- [x] 告诉用户："下次说「继续 MoodWeave」即可"
