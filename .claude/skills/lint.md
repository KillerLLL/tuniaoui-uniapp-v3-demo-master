---
name: lint
description: ESLint 代码检查
---

运行 ESLint 代码质量检查。

**用法：**
- `/lint` - 检查所有文件
- `/lint <文件路径>` - 检查指定文件

**检查规则：**
- 代码风格（单引号、2 空格、无分号）
- Vue 3 最佳实践
- uni-app 规范
- 潜在的代码问题

**注意事项：**
- 继承 @tuniao/eslint-config
- 建议在提交代码前运行
- 可配合 --fix 参数自动修复部分问题
- 项目使用 JavaScript（Vue 3）
