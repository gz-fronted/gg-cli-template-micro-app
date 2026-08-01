# Agent References Index

本目录用于存放团队前端规范。

根据任务类型按需加载对应文件，不要一次性加载全部规范。

| 文件                      | 内容                                                 |
| ------------------------- | ---------------------------------------------------- |
| `tech-stack.md`           | 基础技术栈、组件库、图表库和微前端选型               |
| `requirements.md`         | 产品、接口、UI 优先级及禁止虚构业务定义              |
| `personal-development.md` | 个人开发习惯、补充实践和 Agent 协作约定              |
| `agent-mistakes.md`       | 重复问题错题本；模板初始化为空，按需记录             |
| `react.md`                | React 组件、Hooks 和组件拆分规范                     |
| `state-management.md`     | 局部状态与 Zustand 全局状态规范                      |
| `styling.md`              | Less、CSS Modules 小驼峰命名、Flex、滚动和作用域规范 |
| `ui.md`                   | 页面、表单、Panel、Drawer 和 AG Grid 通用视觉规范    |
| `typescript.md`           | TypeScript 命名、类型、断言和工具类型规范            |
| `api.md`                  | API 请求函数、gzFetch 和请求状态规范                 |
| `gz-fetch-and-mock.md`    | gzFetch 调用、Mock mode、声明式 Mock 与 AI 生成规范  |
| `ag-grid.md`              | AG Grid 默认使用、固定列、文本溢出和 Tooltip 规则    |
| `project-structure.md`    | 根目录、src 目录及各模块职责                         |
| `code-quality.md`         | ESLint、Prettier、any 和未使用代码规范               |
| `tooling.md`              | 脚手架及相关工程工具                                 |

## 常见任务加载建议

### 业务需求开发

```text
requirements.md
personal-development.md
```

如果任务涉及错题本中已有的重复问题，再按需读取 `agent-mistakes.md`。

### 普通 React 页面、表单和视觉开发

```text
react.md
typescript.md
ui.md
styling.md
project-structure.md
```

### 接口和联调开发

```text
api.md
gz-fetch-and-mock.md
typescript.md
project-structure.md
```

### Mock 数据或 Mock Runtime 开发

```text
gz-fetch-and-mock.md
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
