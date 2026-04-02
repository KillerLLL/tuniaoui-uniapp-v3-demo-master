---
name: dev
description: 启动开发服务器
---

启动 TuniaoUI UniApp 项目的开发服务器。

**用法：**
- `/dev` - 默认启动 H5 开发服务器
- `/dev h5` - 启动 H5 开发服务器
- `/dev mp-weixin` - 启动微信小程序开发
- `/dev app` - 启动原生 App 开发

**平台支持：**
- h5 - H5 网页
- mp-weixin - 微信小程序
- app - 原生 App
- mp-alipay - 支付宝小程序
- mp-baidu - 百度小程序
- mp-jd - 京东小程序
- mp-kuaishou - 快手小程序
- mp-lark - 飞书小程序
- mp-qq - QQ 小程序
- mp-toutiao - 抖音小程序
- mp-weixin-union - 微信小程序（uni 内部版）

**注意事项：**
- 使用 pnpm 作为包管理器
- 开发服务器启动后会自动监听文件变化
- 微信小程序开发需要安装微信开发者工具
- 项目使用 JavaScript（Vue 3 + `<script setup>`）
