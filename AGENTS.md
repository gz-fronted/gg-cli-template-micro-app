# AGENTS.md

## 项目说明

本项目采用 React、TypeScript、Vite 和 Garfish 技术栈开发。实际依赖版本以
`package.json` 和锁文件为准。

开发时必须遵循 `docs/agent-references/` 中的团队前端规范。开始任务前先阅读：

```text
docs/agent-references/index.md
```

再根据任务类型加载对应规范，不要一次性加载全部文档。

## 基础技术栈

- React 19
- TypeScript 5
- React Router 7
- Zustand 5
- `@gz-fronted/gz-pc`
- `@chenhui996/gg-ui`
- Ant Design 6（仅在 gg-ui 缺少所需能力时使用）
- AG Grid React Enterprise
- Less 4
- Vite 8
- Garfish
- ECharts / KLineChart

完整选型见：

```text
docs/agent-references/tech-stack.md
```

## 基础开发要求

- 统一使用函数组件和 React Hooks。
- 使用 TypeScript，并提供准确的请求、响应、Props 和状态类型。
- 默认使用 `@chenhui996/gg-ui`；只有 gg-ui 缺少所需能力时才使用 Ant Design。
- 常规业务表格默认使用 AG Grid Enterprise，不得为了省事替换为其他 Table。
- 所有业务颜色使用 `--gz-*` 主题 CSS 变量，不得在 Less/CSS 中写死固定颜色值。
- 遵守项目 ESLint、Stylelint 和 Prettier 规则。
- 不保留未使用的变量或导入，不使用 `any` 规避类型问题。
- 页面、组件、接口、状态、Mock 和工具代码按项目目录规范放置。
- 开发前检查现有实现、产品文档、接口文档和 UI 设计稿；不得虚构业务定义。
- 只修改任务范围内的文件，保留工作区中已有且无关的用户改动。

## 规范加载规则

### 业务需求开发

阅读：

```text
docs/agent-references/requirements.md
docs/agent-references/agent-workflow.md
```

如果任务涉及错题本中已有的重复问题，再读取：

```text
docs/agent-references/agent-mistakes.md
```

### React 组件或 Hooks 开发

阅读：

```text
docs/agent-references/react.md
docs/agent-references/typescript.md
```

### 状态管理开发

阅读：

```text
docs/agent-references/state-management.md
docs/agent-references/typescript.md
```

### UI、表单、样式或视觉还原

阅读：

```text
docs/agent-references/ui.md
docs/agent-references/styling.md
```

编码前必须提取本次任务相关的尺寸、间距、颜色、圆角、滚动、交互状态和组件约束；
完成后必须结合实际运行页面逐项核对，不得只验证功能。

### API 请求和类型开发

阅读：

```text
docs/agent-references/api.md
docs/agent-references/gz-fetch.md
docs/agent-references/typescript.md
```

### 业务 Mock 开发

阅读：

```text
docs/agent-references/mock.md
docs/agent-references/api.md
docs/agent-references/requirements.md
docs/agent-references/typescript.md
docs/agent-references/project-structure.md
```

获得接口文档后，默认生成声明式 Mock 配置和代表性数据，不要求开发者手写 MSW
Handler。只有产品语义、字段关联、敏感数据或状态变化无法确认时才询问。

### Mock Runtime 开发

只有修改通用 Mock Runtime、MSW 集成或相关测试时才阅读：

```text
docs/agent-references/mock-runtime.md
docs/agent-references/mock.md
docs/agent-references/typescript.md
docs/agent-references/code-quality.md
```

### 新增页面、组件或调整目录

阅读：

```text
docs/agent-references/project-structure.md
```

### AG Grid 表格开发

阅读并遵循：

```text
docs/agent-references/ag-grid.md
docs/agent-references/typescript.md
docs/agent-references/ui.md
docs/agent-references/styling.md
```

### 工程配置或脚手架调整

阅读：

```text
docs/agent-references/tooling.md
docs/agent-references/code-quality.md
docs/agent-references/project-structure.md
```

## 开发完成检查

- 没有 ESLint 或 Stylelint 警告和错误。
- TypeScript 类型检查通过，没有为规避问题新增 `any`。
- 新增接口均定义入参和返回类型。
- 新增代码符合目录、命名和作用域规范。
- 功能、异常、边界、滚动和视觉状态按改动范围验证。
- 执行 `code-quality.md` 中与本次改动相关的检查命令，并如实说明未执行项及原因。
