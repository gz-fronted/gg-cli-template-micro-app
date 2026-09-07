# Agent References Index

本目录存放团队前端开发规范。本文件是“任务类型 → 规范文件”的唯一加载路由；
`AGENTS.md` 和 README 只指向本文件，不重复维护任务清单。

## 加载原则

- 开始任务时先判断任务类型，再读取对应规范，不要一次性加载全部文档。
- 一个任务涉及多个类型时合并对应清单并去重。
- 清单中的文件均相对于当前目录 `docs/agent-references/`。
- 规范正文要求按场景继续读取其他文件时，仅在场景实际触发后加载。

## 文档目录

| 文件                   | 内容                                              |
| ---------------------- | ------------------------------------------------- |
| `requirements.md`      | 产品、接口、UI 依据优先级和业务定义边界           |
| `agent-workflow.md`    | Agent 协作、修改边界、验证和错题沉淀流程          |
| `agent-mistakes.md`    | 项目重复问题错题本；模板初始化为空                |
| `tech-stack.md`        | 基础技术栈、组件库、表格、图表和微前端选型        |
| `react.md`             | React 组件、Hooks、目录和拆分规范                 |
| `typescript.md`        | TypeScript 命名、类型、断言和工具类型规范         |
| `state-management.md`  | 局部状态和 Zustand 全局状态规范                   |
| `styling.md`           | Less、CSS Modules、尺寸链、滚动和作用域规范       |
| `ui.md`                | 页面、表单、Panel、Drawer 和视觉验收规范          |
| `ag-grid.md`           | AG Grid 配置、固定列、跨行、文本溢出和验收规则    |
| `api.md`               | API 目录、类型、请求函数和 React 请求状态规范     |
| `gz-fetch.md`          | gzFetch 初始化、调用、Token、响应和错误规范       |
| `mock.md`              | 业务声明式 Mock、数据生成和模块注册规范           |
| `mock-runtime.md`      | Mock Runtime、MSW、Store 和测试维护规范           |
| `project-structure.md` | 根目录、src 目录及模块职责                        |
| `code-quality.md`      | ESLint、Stylelint、Prettier、测试、构建和提交规范 |
| `tooling.md`           | 脚手架及相关工程工具                              |

## 任务加载路由

### 业务需求开发

```text
requirements.md
agent-workflow.md
```

任务涉及错题本中已有问题时，再读取 `agent-mistakes.md`。

### React 组件或 Hooks 开发

```text
react.md
typescript.md
```

新增页面、组件或调整目录时，再读取 `project-structure.md`。

### UI、表单、样式或视觉还原

```text
ui.md
styling.md
```

任务同时修改 React/TypeScript 代码时，再读取 `react.md` 和 `typescript.md`；新增页面、
组件或调整目录时，再读取 `project-structure.md`。编码前提取相关尺寸、间距、颜色、圆角、
滚动、交互状态和组件约束，完成后结合实际运行页面逐项核对。

### 接口和联调开发

```text
api.md
gz-fetch.md
typescript.md
project-structure.md
```

### 业务 Mock 开发

```text
mock.md
api.md
requirements.md
typescript.md
project-structure.md
```

### Mock Runtime 开发

```text
mock-runtime.md
mock.md
typescript.md
code-quality.md
```

### Zustand 状态开发

```text
state-management.md
typescript.md
```

### 新增页面、组件或调整目录

```text
project-structure.md
```

### AG Grid 表格开发

```text
ag-grid.md
react.md
typescript.md
ui.md
styling.md
```

### 微前端子应用开发

```text
tech-stack.md
tooling.md
project-structure.md
```

### 工程或脚手架调整

```text
tooling.md
tech-stack.md
code-quality.md
project-structure.md
```
