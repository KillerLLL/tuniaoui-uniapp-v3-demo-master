---
name: page
description: 创建新页面
---

在 TuniaoUI UniApp 项目中创建新页面。

**用法：**
- `/page <页面路径>` - 创建新页面

**位置：**
- 主包页面: `src/pages/<页面名>/`
- Demo 页面: `src/demo-pages/<分类>/<页面名>/`

**生成的文件：**
```
src/pages/<页面名>/
├── <页面名>.vue    # 页面组件
└── <页面名>.scss   # 页面样式
```

**页面规范：**
- 使用 `<script setup>` 语法
- 使用 uni-app 标签（view/text/image）
- 优先使用 TuniaoUI 组件
- 样式使用 rpx 单位
- 页面需要在 pages.json 中注册
- 项目使用 JavaScript
- **长逻辑（超过10行）必须添加注释说明**
- **复杂逻辑必须添加注释解释处理流程**

**示例：**
`/page user/profile` 创建用户资料页面
