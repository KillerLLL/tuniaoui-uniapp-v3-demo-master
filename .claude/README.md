# TuniaoUI Vue3 UniApp - Claude Code 配置

这个目录包含了 TuniaoUI Vue3 UniApp 项目的 Claude Code 专属配置。

## 目录结构

```
.claude/
├── skills/          # Claude Code 技能
│   ├── dev.md              # 启动开发服务器
│   ├── build.md            # 构建生产版本
│   ├── component.md        # 创建新组件
│   ├── page.md             # 创建新页面
│   ├── type-check.md       # 代码检查
│   ├── lint.md             # 代码检查
│   └── format.md           # 格式化代码
├── agents/          # Claude Code 专用代理
│   ├── component-developer.md   # 组件开发专家
│   ├── demo-creator.md          # Demo 页面创建专家
│   ├── platform-tester.md       # 跨平台测试专家
│   ├── code-reviewer.md         # 代码审查专家
│   ├── bug-fixer.md             # Bug 修复专家
│   ├── stylist.md               # UI 样式专家
│   └── documenter.md            # 文档编写专家
├── settings.json    # Claude Code 配置
└── README.md        # 本文件
```

## Skills（技能）

技能是可以直接调用的命令，用于执行常见任务。

### /dev
启动开发服务器。

```
/dev                 # H5 开发
/dev mp-weixin       # 微信小程序开发
/dev app             # 原生 App 开发
```

### /build
构建生产版本。

```
/build               # H5 构建
/build mp-weixin     # 微信小程序构建
/build app           # 原生 App 构建
```

### /component
创建新的 TuniaoUI 组件。

```
/component button-group
```

### /page
创建新页面。

```
/page user-profile
```

### /type-check
运行 ESLint 代码检查。

### /lint
运行 ESLint 代码检查。

### /format
使用 Prettier 格式化代码。

## Agents（代理）

代理是具有特定专长的 AI 助手，可以处理复杂任务。

### component-developer
TuniaoUI 组件开发专家。负责创建和维护 UI 组件，确保组件符合 TuniaoUI 规范。

### demo-creator
Demo 页面创建专家。负责创建组件演示页面和路由配置。

### platform-tester
跨平台测试专家。确保代码在微信小程序、H5、App 等平台正常运行。

### code-reviewer
代码审查专家。确保代码质量和最佳实践。

### bug-fixer
Bug 修复专家。快速定位和修复问题。

### stylist
UI 样式专家。负责组件样式和主题设计。

### documenter
文档编写专家。负责组件文档和使用说明。

## 使用方式

1. **Skills**：直接在对话中使用，如 `/dev mp-weixin`
2. **Agents**：通过 Claude Code 界面选择合适的代理来处理任务

## 配置说明

settings.json 包含以下配置：
- **permissions**：文件读写权限
- **skills**：技能定义和示例
- **agents**：代理定义和用途
- **hooks**：Git hooks 配置（pre-commit 自动运行 lint）

## 项目信息

- **项目名称**：TuniaoUI Vue3 UniApp Demo
- **技术栈**：UniApp + Vue 3 + JavaScript
- **支持平台**：微信小程序、H5、原生 App 等
- **包管理器**：pnpm

## 其他 AI 工具支持

项目根目录同时提供了通用的 `skills/` 和 `agents/` 目录，可供其他 AI 编程工具使用：

- **Cursor**: 引用根目录的 skills/agents 文件
- **GitHub Copilot**: 复制相关规范内容
- **豆包编程助手**: 参考项目规范
- **Google Gemini**: 使用项目配置
- **其他工具**: 均可使用根目录的通用配置

详见 [skills/README.md](../skills/README.md) 和 [agents/README.md](../agents/README.md)
