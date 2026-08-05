# 代码质量与格式化

- 必须遵守项目配置的 ESLint 和 Prettier 规则。
- 提交代码前确保没有 ESLint 警告或错误。
- 避免使用 `any`，尽可能提供准确类型。
- 不保留未使用的变量或导入。

## 检查命令

根据改动范围执行对应检查：

```bash
# TypeScript / React
npm run lint
npm run typecheck

# Less / CSS
npm run lint:style

# 格式检查
npm run format:check

# 单元测试（单次执行）
npm run test -- --run

# 生产构建
npm run build
```

提交暂存文件时，Husky 和 lint-staged 会自动执行增量检查；这不能替代开发完成后的相关
测试和构建验证。只执行与改动范围相关的命令；未执行项必须说明原因。

## 提交信息

提交信息必须通过 commitlint，并遵循 Conventional Commits，例如：

```text
feat(router): 增加路由配置
fix(request): 修复请求错误处理
docs: 更新项目说明
```
