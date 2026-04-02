---
name: component
description: 创建新组件
---

创建新的 TuniaoUI 组件，遵循项目规范。

**用法：**
- `/component <组件名>` - 创建新组件

**生成的文件结构：**
```
tuniaoui/tn-<组件名>/
├── src/
│   ├── props.js          # 组件属性定义
│   ├── use-<组件名>.js   # 组合式函数
│   └── <组件名>.vue      # 组件实现
├── style/
│   └── <组件名>.scss     # 组件样式
└── index.js              # 组件导出
```

**组件规范：**
- 使用 `<script setup>` 语法
- 响应式使用 ref
- 属性必须定义默认值和类型（用 JSDoc 注释）
- 事件使用 emit 发送
- 样式使用 scoped
- 支持 uni-app 多平台
- 样式单位使用 rpx
- **长逻辑（超过10行）必须添加注释说明**
- **复杂逻辑必须添加注释解释处理流程**

**示例：**
`/component badge` 创建 tn-badge 组件
