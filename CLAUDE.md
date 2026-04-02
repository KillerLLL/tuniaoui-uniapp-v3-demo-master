# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚨 重要：多智能体协作系统（默认启用）

**本项目已强制启用多智能体协作系统，所有任务必须按以下流程自动执行。**

### 强制执行流程

任何用户需求都必须**自动**按顺序通过以下5个智能体处理，**不能跳过任何步骤**：

```
用户需求
    ↓
【1️⃣ 人性脑】意图识别 → 任务定位
    ↓
【2️⃣ 科学脑】方案设计 → 逻辑拆解
    ↓
【3️⃣ 学者脑】规范检查 → 依据提供
    ↓
【4️⃣ 质疑官】风险评估 → 可行性分析
    ↓
【5️⃣ 执行者】整合输出 → 最终结果
```

### 每个智能体的职责

#### 1️⃣ 人性脑（Human Brain）
- 识别用户真实需求和隐藏意图
- 确定任务目标、方向和优先级
- 输出：清晰的任务定位

#### 2️⃣ 科学脑（Science Brain）
- 将问题拆解为可执行步骤
- 补齐缺失条件和边界场景
- 构建完整的逻辑链路
- 输出：执行方案 + 详细步骤

#### 3️⃣ 学者脑（Scholar Brain）
- 对照项目编码规范进行检查
- 提供技术选型的事实依据
- 明确不可违反的原则
- 输出：规范清单 + 质量标准

#### 4️⃣ 质疑官（Critic Brain）
- 站在批判视角审视方案
- 识别风险、漏洞和不可行点
- 提出改进建议
- 输出：质疑点 + 风险 + 优化建议

#### 5️⃣ 执行者（Executor Brain）
- 综合前4个智能体的全部结论
- 修正问题、统一逻辑
- 输出最终可直接使用的结果
- 严格遵守前端编码规范

### 强制规则

- ✅ **必须**按顺序执行全部5个智能体
- ✅ **必须**完成每个智能体的核心任务
- ✅ **必须**主动补齐缺失信息
- ✅ **必须**自己闭环完成思考
- ❌ **不能**跳过任何一个智能体
- ❌ **不能**向用户询问或确认
- ❌ **不能**等待用户补充信息

### 项目编码规范

- **框架**: Vue 3 + `<script setup>`
- **语言**: JavaScript
- **平台**: uni-app (H5、微信小程序、App)
- **UI库**: TuniaoUI
- **包管理**: pnpm

### 代码规范

- 单引号、2空格、无分号
- 使用 uni-app 标签 (view/text/image)
- 样式单位使用 rpx
- **长逻辑(超过10行)必须添加注释**
- **复杂逻辑必须添加注释解释处理流程**

---

## Project Overview

This is **TuniaoUI Vue3 UniApp Demo** - a demo project for the TuniaoUI component library. It showcases 60+ UI components built with UniApp, Vue 3, and JavaScript. The project supports multiple platforms including WeChat Mini Program, H5, and native apps.

## Common Commands

### Development
- `pnpm run dev:h5` - Start H5 development server
- `pnpm run dev:mp-weixin` - Start WeChat Mini Program development
- `pnpm run dev:app` - Start native app development

### Building
- `pnpm run build:h5` - Build for H5 production
- `pnpm run build:mp-weixin` - Build for WeChat Mini Program
- `pnpm run build:app` - Build for native app production

### Code Quality
- `pnpm run lint` - Run ESLint code check

### Package Management
This project uses **pnpm** as the package manager.

## Architecture

### Directory Structure
- `src/pages/` - Main application pages
- `src/demo-pages/` - Component demos organized by category (basic/, component/)
- `src/plugin-demo/` - Plugin component demos (tn-color-select, tn-comment-list, etc.)
- `src/components/` - Custom demo components (custom-page, demo-container)
- `src/hooks/` - Composable functions (use-demo-h5-page, use-wx-share)
- `src/config/` - Configuration files (upload headers)
- `tuniaoui/` - Local TuniaoUI component library (aliased from @tuniao/tnui-vue3-uniapp)
- `src/static/` - Static assets

### Key Configuration
- `vite.config.ts` - Vite configuration with UniApp plugin
- `pages.json` - UniApp routing configuration with subPackages structure
- `.eslintrc.json` - Extends @tuniao/eslint-config
- `.prettierrc` - Prettier config: single quotes, no semicolons, 80 char width

### Entry Point
- `src/main.ts` - Creates app, globally registers TnIcon component
- `src/App.vue` - Root component, imports TuniaoUI styles

### Component Library Structure
The tuniaoui/ directory contains the full TuniaoUI component library with 60+ components organized by feature.

## Code Style
- Single quotes, no semicolons
- 2 spaces indentation
- 80 character line width
- ES5 trailing commas

## Platform Support
Supports WeChat Mini Program (mp-weixin), H5, native app, and multiple other mini-program platforms (Alipay, Baidu, JD, Kuaishou, etc.)

## Claude Code Skills & Agents

This project includes specialized skills and agents configured in `.claude/` directory.

### Skills (可用命令)
- `/dev` - 启动开发服务器
- `/build` - 构建生产版本
- `/component` - 创建新组件
- `/page` - 创建新页面
- `/lint` - 代码检查
- `/format` - 格式化代码

### Agents (专用代理)
- `component-developer` - TuniaoUI 组件开发专家
- `demo-creator` - Demo 页面创建专家
- `platform-tester` - 跨平台测试专家
- `code-reviewer` - 代码审查专家
- `bug-fixer` - Bug 修复专家
- `stylist` - UI 样式专家
- `documenter` - 文档编写专家

### Multi-Agent System (多智能体系统)
- `human-brain` - 人性脑：意图识别
- `science-brain` - 科学脑：方案设计
- `scholar-brain` - 学者脑：规范检查
- `critic-brain` - 质疑官：风险评估
- `executor-brain` - 执行者：整合输出

**注意：多智能体系统已默认启用，所有任务都会自动通过5个智能体协作完成。**

查看 [`.claude/README.md`](.claude/README.md) 和 [`.claude/multi-agent/README.md`](.claude/multi-agent/README.md) 了解更多详情。
