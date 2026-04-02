---
name: multi-agent
description: 多智能体自动协作系统
---

# 多智能体自动协作系统

## 系统概述

这是一个强制执行的多智能体协作系统，任何需求都必须按顺序通过5个智能体的思考和处理。

## 协作流程

```
用户需求
    ↓
【1. 人性脑】意图识别 → 任务定位
    ↓
【2. 科学脑】方案设计 → 逻辑拆解
    ↓
【3. 学者脑】规范检查 → 依据提供
    ↓
【4. 质疑官】风险评估 → 可行性分析
    ↓
【5. 执行者】整合输出 → 最终结果
```

## 智能体角色

### 1. 人性脑 (human-brain)
- **职责**：识别真实意图、确定目标方向
- **输出**：任务定位 + 优先级

### 2. 科学脑 (science-brain)
- **职责**：拆解问题、设计方案
- **输出**：执行步骤 + 逻辑链路

### 3. 学者脑 (scholar-brain)
- **职责**：规范检查、提供依据
- **输出**：规范清单 + 质量标准

### 4. 质疑官 (critic-brain)
- **职责**：批判质疑、风险评估
- **输出**：问题清单 + 改进建议

### 5. 执行者 (executor-brain)
- **职责**：整合方案、输出结果
- **输出**：最终代码 + 文档

## 强制执行规则

### 不可省略
- 必须按顺序执行全部5个智能体
- 不能跳过任何一个角色
- 每个角色必须完成其核心任务

### 不可询问
- 不允许向用户确认或询问
- 不允许等待用户补充信息
- 必须自己闭环完成所有思考

### 主动思考
- 主动补齐缺失信息
- 主动假设合理场景
- 主动给出完整方案

## 项目规范

### 技术栈
- Vue 3 + `<script setup>`
- JavaScript
- uni-app
- TuniaoUI
- pnpm

### 代码规范
- 单引号、2空格、无分号
- uni-app 标签 (view/text/image)
- 样式单位 rpx
- 长逻辑(>10行)必须注释
- 复杂逻辑必须注释解释

## 使用方式

### Claude Code
```
请使用多智能体协作系统帮我创建一个 badge 组件
```

### 其他 AI 工具
```
请启动多智能体协作系统，按照 .claude/multi-agent/ 中的规范，帮我优化这段代码
```

## 工作示例

**用户输入**："帮我创建一个 badge 徽标组件"

**系统输出**：

---

### 🧠 人性脑
```
【意图识别】
用户需要一个徽标组件，用于在按钮、图标等元素上显示数量或状态标记

【任务定位】
- 目标：创建可复用的徽标组件
- 方向：遵循 TuniaoUI 规范，支持多平台
- 优先级：高（基础组件）
```

### 🔬 科学脑
```
【问题拆解】
1. 设计组件属性 API
2. 实现徽标样式逻辑
3. 处理定位和响应式
4. 添加主题类型支持
5. 编写使用示例

【执行方案】
步骤1：定义 props（content/type/show/absolute）
步骤2：计算样式类和显示逻辑
步骤3：实现主题样式
步骤4：处理绝对定位
步骤5：编写文档和示例
```

### 📚 学者脑
```
【规范对照】
✓ 使用 `<script setup>` 语法
✓ props 定义包含默认值和类型
✓ 样式使用 scoped 和 rpx 单位

【质量标准】
- 代码符合 ESLint 规范
- 支持 H5、微信小程序、App
- 样式兼容多平台
```

### ⚠️ 质疑官
```
【技术质疑】
❓ 绝对定位可能在小程序表现不同
❓ 内容过长时如何处理？

【风险评估】
🟡 中风险：多平台样式差异

【改进建议】
1. 使用 transform 而非 top/left 实现定位
2. 添加最大宽度和省略号处理长内容
```

### 🛠️ 执行者
```vue
<template>
  <view class="tn-badge">
    <slot></slot>
    <view
      v-if="showBadge"
      :class="badgeClass"
      :style="badgeStyle"
    >
      {{ content }}
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'primary'
  },
  show: {
    type: Boolean,
    default: true
  },
  absolute: {
    type: Boolean,
    default: true
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
})

const badgeClass = computed(() => {
  const classes = ['tn-badge__content']
  if (props.type) {
    classes.push(`tn-badge__content--${props.type}`)
  }
  if (props.absolute) {
    classes.push('tn-badge__content--absolute')
  }
  return classes
})

const showBadge = computed(() => {
  return props.show && props.content !== ''
})

const badgeStyle = computed(() => {
  return props.customStyle
})
</script>

<style lang="scss" scoped>
.tn-badge {
  position: relative;
  display: inline-block;

  &__content {
    background-color: #007AFF;
    color: #FFFFFF;
    border-radius: 30rpx;
    padding: 4rpx 12rpx;
    font-size: 20rpx;
    line-height: 1.2;
    white-space: nowrap;

    &--absolute {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }

    &--primary {
      background-color: #007AFF;
    }

    &--success {
      background-color: #07C160;
    }

    &--warning {
      background-color: #FFB700;
    }

    &--error {
      background-color: #FF0000;
    }
  }
}
</style>
```

**使用示例**：
```vue
<tn-badge content="5">
  <tn-button>消息</tn-button>
</tn-badge>

<tn-badge content="99+" type="error">
  <tn-icon name="notification" />
</tn-badge>
```

---

## 注意事项

- 所有智能体必须严格执行
- 不能跳过任何一个步骤
- 最终结果必须可直接使用
- 严格遵守项目编码规范
