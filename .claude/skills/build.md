---
name: build
description: 构建生产版本
---

构建 TuniaoUI UniApp 项目的生产版本。

**用法：**
- `/build` - 默认构建 H5 生产版本
- `/build h5` - 构建 H5 生产版本
- `/build mp-weixin` - 构建微信小程序
- `/build app` - 构建原生 App

**输出位置：**
- H5: `dist/build/h5/`
- 微信小程序: `dist/build/mp-weixin/`
- App: `dist/build/app/`

**注意事项：**
- 构建前会自动进行 ESLint 代码检查
- 生产版本会压缩代码并优化资源
- 构建完成后请检查输出目录
- 项目使用 JavaScript（Vue 3）
