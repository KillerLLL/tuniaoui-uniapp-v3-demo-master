# 各 AI 工具配置状态

| 工具 | 配置文件 | 状态 | 说明 |
|------|----------|------|------|
| **Claude Code** | `.claude/` | ✅ 原生支持 | 完整配置，可主动触发 skills/agents |
| **Cursor** | `.cursorrules` | ✅ 已配置 | Cursor 会自动读取规则 |
| **Cursor** | `.cursor/rules.md` | ✅ 已配置 | Cursor 自定义规则 |
| **GitHub Copilot** | `.github/copilot-instructions.md` | ✅ 已配置 | Copilot 会读取项目说明 |
| **豆包** | `PROJECT_CONTEXT.md` | ⚠️ 需手动 | 复制 skills/agents 内容 |
| **Gemini** | `PROJECT_CONTEXT.md` | ⚠️ 需手动 | 复制 skills/agents 内容 |
| **Continue** | `PROJECT_CONTEXT.md` | ⚠️ 需手动 | 复制 skills/agents 内容 |
| **Tabnine** | `PROJECT_CONTEXT.md` | ⚠️ 需手动 | 复制 skills/agents 内容 |

## 当前状态

### ✅ 可主动触发（自动识别）
- **Claude Code**: `.claude/skills/` `.claude/agents/` + `settings.json`
- **Cursor**: `.cursorrules` + `.cursor/rules.md`
- **GitHub Copilot**: `.github/copilot-instructions.md`

### ⚠️ 需手动引用
- 其他工具请引用 `skills/` 和 `agents/` 目录

## 使用方式

### Claude Code
```
/dev h5
```

### Cursor / Copilot
工具会自动读取配置文件，无需手动触发

### 其他工具
```
请参考 skills/dev.md 启动开发服务器
你现在是一个 TuniaoUI 组件开发专家，请参考 agents/component-developer.md
```

## 配置说明

### .cursorrules
Cursor 会自动读取项目根目录的此文件，作为编码规范和项目上下文。

### .cursor/rules.md
Cursor 的自定义规则文件，可定义更详细的指令。

### .github/copilot-instructions.md
GitHub Copilot 会读取此文件作为项目上下文。

### skills/ 和 agents/
通用提示词和角色定义，可供所有 AI 工具参考。
