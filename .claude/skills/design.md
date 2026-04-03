# Frontend Design - 前端设计技能

使用 AI 视觉能力分析设计稿图片，并将其转换为 TuniaoUI Vue3 UniApp 代码。

## 触发方式

```
/design
```

## 使用场景

当你有一张 UI 设计稿（PNG、JPG、WebP 等图片格式）时，使用此技能可以让 AI 分析图片并生成对应的前端代码。

## 使用方法

1. 输入 `/design` 命令
2. AI 会提示你上传或描述设计稿图片
3. 提供图片后，AI 会：
   - 分析图片中的 UI 布局和元素
   - 识别组件类型（按钮、卡片、列表、表单等）
   - 生成对应的 TuniaoUI Vue3 UniApp 代码
   - 提供完整的页面结构

## 输出内容

- **页面结构**：Vue 单文件组件（`<template>` 部分）
- **样式代码**：使用 TuniaoUI 组件和 rpx 单位
- **业务逻辑**：Vue 3 `<script setup>` 逻辑代码（如需要）
- **组件建议**：使用的 TuniaoUI 组件列表

## 约束与规范

### 必须遵守
- 使用 TuniaoUI 组件库
- 使用 `<script setup>` 语法
- 样式单位使用 rpx
- 单引号、2空格缩进、无分号
- 遵循项目代码规范

### 组件选择原则
- 优先使用 TuniaoUI 组件
- 合理使用 flex 布局
- 考虑多端兼容性（H5、小程序、App）

## 示例

用户提供一张底部导航的设计图，AI 会生成：

```vue
<template>
  <view class="bottom-nav">
    <view class="nav-item" v-for="(item, index) in navList" :key="index">
      <tn-icon :name="item.icon" />
      <text class="nav-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
const navList = [
  { icon: 'home', text: '首页' },
  { icon: 'discover', text: '发现' },
  { icon: 'message', text: '消息' },
  { icon: 'my', text: '我的' }
]
</script>

<style scoped>
.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  background: #ffffff;
}
</style>
```

## 注意事项

- 图片越清晰、UI 边界越明确，还原效果越好
- 复杂布局可能需要多次调整
- 生成代码需根据实际业务逻辑进行调整