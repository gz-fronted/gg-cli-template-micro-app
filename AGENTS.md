# AGENTS.md

## 项目说明

本项目采用 React、TypeScript、Vite 和 Garfish 技术栈开发。

开发时必须遵循团队前端规范。详细规范位于：

```text
docs/agent-references/
```

开始任务前，先阅读：

```text
docs/agent-references/index.md
```

再根据当前任务类型加载对应规范，不要一次性加载全部规范。

## 基础技术栈

- React 19
- TypeScript 5
- React Router 7
- Zustand 5
- Axios 1
- Less 4
- Vite 8
- Garfish
- `@chenhui996/gg-ui`
- AG Grid React Enterprise
- ECharts
- KLineChart

完整说明见：

```text
docs/agent-references/tech-stack.md
```

## 基础开发要求

- 统一使用函数组件和 React Hooks。
- 使用 TypeScript，并尽可能提供准确类型。
- 默认使用 `@chenhui996/gg-ui` 作为业务组件库。
- 当 gg-ui 暂未提供所需组件时，允许使用 Ant Design 6。
- 默认使用 AG Grid React Enterprise 实现业务表格。
- 不得使用其他表格组件替代 AG Grid，除非需求明确不适用或已有项目实现要求保留。
- 遵守项目 ESLint 和 Prettier 规则。
- 不保留未使用的变量或导入。
- 避免使用 `any` 规避类型问题。
- 页面、组件、接口、状态和工具代码应按项目目录规范放置。
- 开发前应先阅读与当前任务直接相关的规范文件。
- 规范未覆盖的内容，以现有项目实现和需求说明为准。

## 规范加载规则

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
```

### 个人开发规范

开发业务需求时，必须阅读：

```text
docs/agent-references/personal-development.md
```

如果任务涉及已有重复错误，还必须阅读：

```text
docs/agent-references/agent-mistakes.md
```

### 样式开发

阅读：

```text
docs/agent-references/styling.md
```

### API 请求和类型开发

阅读：

```text
docs/agent-references/api.md
docs/agent-references/typescript.md
```

### 新增页面、组件或调整目录

阅读：

```text
docs/agent-references/project-structure.md
```

### AG Grid 表格开发

阅读：

```text
docs/agent-references/ag-grid.md
docs/agent-references/typescript.md
docs/agent-references/styling.md
```

### 工程配置或脚手架相关开发

阅读：

```text
docs/agent-references/tooling.md
docs/agent-references/code-quality.md
```

## 开发完成检查

开发完成后，应确保：

- 没有 ESLint 警告或错误。
- 没有未使用的变量或导入。
- 没有为了规避问题而随意使用 `any`。
- 新增接口均定义入参和返回类型。
- 新增代码符合对应目录和命名规范。
