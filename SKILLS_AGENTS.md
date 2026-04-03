# Skills & Agents 使用指南

## Skills（技能命令）

| 名称 | 描述 | 使用命令 |
|------|------|----------|
| **dev** | 启动开发服务器 | `/dev` - 启动H5开发服务器<br>`/dev mp-weixin` - 微信小程序<br>`/dev app` - 原生App |
| **build** | 构建生产版本 | `/build` - 构建H5<br>`/build mp-weixin` - 微信小程序<br>`/build app` - 原生App |
| **component** | 创建新组件 | `/component <组件名>` - 创建TuniaoUI组件 |
| **page** | 创建新页面 | `/page <页面路径>` - 创建页面 |
| **lint** | ESLint代码检查 | `/lint` - 检查所有文件<br>`/lint <文件路径>` - 检查指定文件 |
| **format** | Prettier代码格式化 | `/format` - 格式化所有文件<br>`/format <文件路径>` - 格式化指定文件 |
| **type-check** | ESLint类型检查 | `/type-check` - 运行ESLint检查 |
| **design** | 设计稿转代码 | `/design` - 分析UI图片生成Vue/UniApp代码 |
| **ui2code** | UI截图还原 | `/ui2code` - 将设计稿图片还原为前端代码 |
| **multi-agent** | 启动多智能体协作 | `/multi-agent <需求>` - 启用5智能体协作系统 |

---

## Agents（专用代理）

### 业务专家 Agents

| 名称 | 描述 | 使用场景 |
|------|------|----------|
| **component-developer** | TuniaoUI组件开发专家 | 创建和维护UI组件 |
| **demo-creator** | Demo页面创建专家 | 创建组件演示页面 |
| **code-reviewer** | 代码审查专家 | 确保代码质量和最佳实践 |
| **bug-fixer** | Bug修复专家 | 快速定位和修复问题 |
| **platform-tester** | 跨平台测试专家 | 确保代码在各平台正常运行 |
| **stylist** | UI样式专家 | 组件样式和主题设计 |
| **documenter** | 文档编写专家 | 组件文档和使用说明 |
| **design** | UI设计专家 | 分析设计稿图片并生成代码 |

### 多智能体协作 Agents

| 名称 | 描述 | 协作顺序 |
|------|------|----------|
| **human-brain** | 人性脑 - 意图识别 | 第1步：识别用户真实需求 |
| **science-brain** | 科学脑 - 方案设计 | 第2步：构建完整解决方案 |
| **scholar-brain** | 学者脑 - 规范检查 | 第3步：确保符合规范标准 |
| **critic-brain** | 质疑官 - 风险评估 | 第4步：批判性审查风险 |
| **executor-brain** | 执行者 - 整合输出 | 第5步：整合输出最终结果 |

---

## 多智能体协作系统

### 工作流程

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

### 强制规则

- 必须按顺序执行全部5个智能体
- 不能跳过任何一个角色
- 不向用户询问或确认
- 自动补齐缺失信息
- 闭环完成思考

### 触发方式

```
/multi-agent 帮我创建一个 badge 组件
/multi-agent 优化这段代码的性能
```

---

## 项目技术栈

- **框架**: Vue 3 + `<script setup>`
- **语言**: JavaScript
- **平台**: uni-app (H5、微信小程序、App)
- **UI库**: TuniaoUI
- **包管理**: pnpm

## 代码规范

- 单引号、2空格、无分号
- uni-app 标签 (view/text/image)
- 样式单位使用 rpx
- 长逻辑(超过10行)必须添加注释
- 复杂逻辑必须添加注释解释处理流程