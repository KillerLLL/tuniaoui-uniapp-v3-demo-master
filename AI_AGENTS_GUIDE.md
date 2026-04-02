# TuniaoUI UniApp - AI 编程助手通用指南

本项目提供可在多个 AI 编程工具中使用的提示词和角色配置。

## 🎯 支持的 AI 工具

| 工具 | Claude Code | Cursor | Copilot | 豆包 | Gemini | 其他 |
|------|-------------|--------|---------|------|--------|------|
| 配置位置 | `.claude/` | `skills/` `agents/` | `skills/` `agents/` | `skills/` `agents/` | `skills/` `agents/` | `skills/` `agents/` |
| 状态 | ✅ 原生 | ✅ 可用 | ✅ 可用 | ✅ 可用 | ✅ 可用 | ✅ 可用 |

## 📁 目录结构

```
tuniaoui-uniapp-v3-demo-master/
├── .claude/              # Claude Code 专属配置
│   ├── skills/           # 带有 frontmatter 的技能
│   ├── agents/           # 带有 frontmatter 的代理
│   └── settings.json     # Claude Code 配置
├── skills/               # 🆕 通用提示词（无 frontmatter）
├── agents/               # 🆕 通用角色（无 frontmatter）
└── AI_AGENTS_GUIDE.md    # 本文件
```

## 🚀 快速开始

### Claude Code 用户
直接使用，无需额外配置：
- Skills: `/dev`、`/build`、`/component` 等
- Agents: 选择对应的专家代理

### 其他 AI 工具用户

#### 方式一：直接引用
```
请参考 skills/dev.md 启动 H5 开发服务器
你现在是一个 TuniaoUI 组件开发专家，请参考 agents/component-developer.md
```

#### 方式二：复制内容
将 `skills/` 或 `agents/` 中的文件内容复制粘贴给 AI

#### 方式三：项目配置
创建项目级配置文件：

**Cursor (.cursorrules)**
```bash
cat agents/*.md > .cursorrules
```

**通用 (PROJECT_GUIDE.md)**
```bash
cat skills/*.md agents/*.md > PROJECT_GUIDE.md
```

## 📋 可用技能 (skills/)

| 技能 | 说明 | 命令示例 |
|------|------|----------|
| dev | 启动开发服务器 | `pnpm run dev:h5` |
| build | 构建生产版本 | `pnpm run build:h5` |
| component | 创建新组件 | `/component badge` |
| page | 创建新页面 | `/page user/profile` |
| type-check | 代码检查 | `pnpm run type-check` |
| lint | 代码检查 | `pnpm run lint` |
| format | 代码格式化 | `pnpm run format` |

## 👥 可用角色 (agents/)

| 角色 | 说明 | 使用场景 |
|------|------|----------|
| component-developer | 组件开发专家 | 创建/维护 TuniaoUI 组件 |
| demo-creator | Demo 页面专家 | 创建组件演示页面 |
| platform-tester | 跨平台测试专家 | 测试多平台兼容性 |
| code-reviewer | 代码审查专家 | 审查代码质量 |
| bug-fixer | Bug 修复专家 | 定位和修复问题 |
| stylist | UI 样式专家 | 设计组件样式 |
| documenter | 文档编写专家 | 编写组件文档 |

## 💡 使用示例

### 创建组件
```
你现在是一个 TuniaoUI 组件开发专家，请参考 agents/component-developer.md 的规范帮我创建一个 badge 组件
```

### 修复 Bug
```
你现在是一个 Bug 修复专家，请参考 agents/bug-fixer.md 的规范帮我定位和修复以下问题：[问题描述]
```

### 代码审查
```
请作为代码审查专家（参考 agents/code-reviewer.md）审查以下代码：
[代码]
```

### 启动开发
```
请按照 skills/dev.md 的说明启动微信小程序开发服务器
```

## 🛠️ 项目技术栈

- **框架**: Vue 3 + `<script setup>`
- **语言**: JavaScript
- **平台**: uni-app（H5、微信小程序、App）
- **UI 库**: TuniaoUI (@tuniao/tnui-vue3-uniapp)
- **包管理**: pnpm

## 📐 代码规范

- **风格**: 单引号、2 空格、无分号
- **标签**: 仅使用 uni-app 标签（view/text/image）
- **样式**: 使用 rpx 单位
- **注释**:
  - 长逻辑（超过10行）必须添加注释说明
  - 复杂逻辑必须添加注释解释处理流程
- **组件**: 使用 `<script setup>` 语法

## 📚 更多信息

- [Claude Code 配置](.claude/README.md)
- [Skills 详细说明](skills/README.md)
- [Agents 详细说明](agents/README.md)
- [TuniaoUI 官方文档](https://www.untitled.top/)

## ⚠️ 注意事项

1. `.claude/` 目录是 Claude Code 专属，带有 frontmatter
2. 根目录的 `skills/` 和 `agents/` 是通用版本，无 frontmatter
3. 其他 AI 工具请使用根目录的通用版本
4. 可根据项目需求自定义内容

祝你编码愉快！🚀
