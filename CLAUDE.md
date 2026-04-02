# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **TuniaoUI Vue3 UniApp Demo** - a demo project for the TuniaoUI component library. It showcases 60+ UI components built with UniApp, Vue 3, and TypeScript. The project supports multiple platforms including WeChat Mini Program, H5, and native apps.

## Common Commands

### Development
- `npm run dev:h5` - Start H5 development server
- `npm run dev:mp-weixin` - Start WeChat Mini Program development
- `npm run dev:app` - Start native app development

### Building
- `npm run build:h5` - Build for H5 production
- `npm run build:mp-weixin` - Build for WeChat Mini Program
- `npm run build:app` - Build for native app production

### Code Quality
- `npm run type-check` - Run TypeScript type checking with vue-tsc

### Package Management
This project uses **pnpm** as the package manager. Use `pnpm install` instead of npm install.

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
- `vite.config.ts` - Vite configuration with UniApp plugin, aliases @tuniao/tnui-vue3-uniapp to local tuniaoui/ directory
- `pages.json` - UniApp routing configuration with subPackages structure
- `tsconfig.json` - TypeScript config with path alias @/* pointing to ./src/*
- `.eslintrc.json` - Extends @tuniao/eslint-config
- `.prettierrc` - Prettier config: single quotes, no semicolons, 80 char width

### Entry Point
- `src/main.ts` - Creates SSR app, globally registers TnIcon component
- `src/App.vue` - Root component, imports TuniaoUI styles

### Component Library Structure
The tuniaoui/ directory contains the full TuniaoUI component library with 60+ components organized by feature (action-sheet, avatar, badge, button, calendar, checkbox, etc.). Each component has its own src/ directory with the component implementation.

### Routing
- Main pages defined in pages.json root
- SubPackages for demo-pages, plugin-demo, info-pages
- Custom navigation bar style (navigationStyle: "custom")
- Preload rule preloads all subPackages from index page

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
- `/dev` - 启动开发服务器（支持 h5, mp-weixin, app 等平台）
- `/build` - 构建生产版本
- `/component` - 创建新的 TuniaoUI 组件
- `/page` - 创建新页面
- `/type-check` - TypeScript 类型检查
- `/lint` - ESLint 代码检查
- `/format` - Prettier 代码格式化

### Agents (专用代理)
- `component-developer` - TuniaoUI 组件开发专家
- `demo-creator` - Demo 页面创建专家
- `platform-tester` - 跨平台测试专家
- `code-reviewer` - 代码审查专家
- `bug-fixer` - Bug 修复专家
- `stylist` - UI 样式专家
- `documenter` - 文档编写专家

查看 [`.claude/README.md`](.claude/README.md) 了解更多详情。
