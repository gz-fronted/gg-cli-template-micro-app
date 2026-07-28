# Agent References Index

本目录用于存放团队前端规范。

根据任务类型按需加载对应文件，不要一次性加载全部规范。

| 文件                   | 内容                                      |
| ---------------------- | ----------------------------------------- |
| `tech-stack.md`        | 基础技术栈、组件库、图表库和微前端选型    |
| `react.md`             | React 组件、Hooks 和组件拆分规范          |
| `state-management.md`  | 局部状态与 Zustand 全局状态规范           |
| `styling.md`           | Less、CSS Modules 和样式命名规范          |
| `typescript.md`        | TypeScript 命名、类型、断言和工具类型规范 |
| `api.md`               | API 请求函数、统一响应体和请求类型规范    |
| `ag-grid.md`           | AG Grid 默认使用规则                      |
| `project-structure.md` | 根目录、src 目录及各模块职责              |
| `code-quality.md`      | ESLint、Prettier、any 和未使用代码规范    |
| `tooling.md`           | 脚手架及相关工程工具                      |

## 常见任务加载建议

### 普通 React 页面开发

```text
react.md
typescript.md
styling.md
project-structure.md
```

### 接口和联调开发

```text
api.md
typescript.md
project-structure.md
```

### Zustand 状态开发

```text
state-management.md
typescript.md
```

### 表格开发

```text
ag-grid.md
react.md
typescript.md
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
