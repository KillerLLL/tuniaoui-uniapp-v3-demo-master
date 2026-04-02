# TuniaoUI Vue3 UniApp - Claude Code 配置

这个目录包含了 TuniaoUI Vue3 UniApp 项目的 Claude Code 专属配置。

## 🚨 重要：多智能体协作系统（默认启用）

**本项目已强制启用多智能体协作系统，所有任务都会自动通过5个智能体协作完成。**

### 协作流程

```
用户需求
    ↓
【人性脑】意图识别 → 任务定位
    ↓
【科学脑】方案设计 → 逻辑拆解
    ↓
【学者脑】规范检查 → 依据提供
    ↓
【质疑官】风险评估 → 可行性分析
    ↓
【执行者】整合输出 → 最终结果
```

### 强制规则

- ✅ 必须按顺序执行全部5个智能体
- ✅ 必须主动补齐缺失信息
- ✅ 必须闭环完成思考
- ❌ 不能跳过任何步骤
- ❌ 不能向用户询问

**无需手动触发，系统会自动应用多智能体协作模式。**

详见 [`.claude/multi-agent/README.md`](multi-agent/README.md)

---

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
│   ├── format.md           # 格式化代码
│   └── multi-agent.md      # 多智能体系统
├── agents/          # Claude Code 专用代理
│   ├── component-developer.md   # 组件开发专家
│   ├── demo-creator.md          # Demo 页面创建专家
│   ├── platform-tester.md       # 跨平台测试专家
│   ├── code-reviewer.md         # 代码审查专家
│   ├── bug-fixer.md             # Bug 修复专家
│   ├── stylist.md               # UI 样式专家
│   └── documenter.md            # 文档编写专家
├── multi-agent/    # 多智能体系统配置
│   ├── human-brain.md           # 人性脑
│   ├── science-brain.md         # 科学脑
│   ├── scholar-brain.md         # 学者脑
│   ├── critic-brain.md          # 质疑官
│   ├── executor-brain.md        # 执行者
│   └── README.md
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

### /multi-agent
控制多智能体系统（通常自动启用）。
```
/multi-agent                # 查看状态
/multi-agent <需求>         # 使用多智能体处理
```

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

## Multi-Agent System（多智能体系统）

### 5个智能体

| 智能体 | 文件 | 职责 |
|--------|------|------|
| 🧠 人性脑 | `human-brain.md` | 识别意图、确定目标 |
| 🔬 科学脑 | `science-brain.md` | 方案设计、逻辑拆解 |
| 📚 学者脑 | `scholar-brain.md` | 规范检查、依据提供 |
| ⚠️ 质疑官 | `critic-brain.md` | 风险评估、可行性分析 |
| 🛠️ 执行者 | `executor-brain.md` | 整合输出、最终结果 |

**注意**：多智能体系统已默认启用，无需手动触发。

## 配置说明

settings.json 包含以下配置：
- **permissions**：文件读写权限
- **skills**：技能定义和示例
- **agents**：代理定义和用途
- **multiAgentSystem**：多智能体系统配置（已启用）
- **hooks**：Git hooks 配置（pre-commit 自动运行 lint）

## 项目信息

- **项目名称**：TuniaoUI Vue3 UniApp Demo
- **技术栈**：UniApp + Vue 3 + JavaScript
- **支持平台**：微信小程序、H5、原生 App 等
- **包管理器**：pnpm

### 代码规范

- 单引号、2空格、无分号
- 使用 `<script setup>` 语法
- 使用 uni-app 标签（view/text/image）
- 样式单位使用 rpx
- **长逻辑(超过10行)必须添加注释**
- **复杂逻辑必须添加注释解释处理流程**
