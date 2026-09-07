# AGENTS.md

## 项目说明

本项目采用 React、TypeScript、Vite 和 Garfish 技术栈开发。模板依赖范围以
`package.json` 为准；脚手架生成项目安装依赖后，以生成的锁文件和已安装包类型为准。

开发时必须遵循 `docs/agent-references/` 中的团队前端规范。开始任务前先阅读：

```text
docs/agent-references/index.md
```

`index.md` 是“任务类型 → 规范文件”的唯一加载路由。根据任务类型加载直接相关规范，不要
一次性加载全部文档，也不要在 `AGENTS.md` 或 README 中复制路由清单。

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

## 规范加载

- 任务路由统一由 `docs/agent-references/index.md` 维护。
- 一个任务涉及多个类型时，合并对应规范并去重，只读取与当前改动直接相关的内容。
- 规范中引用的专项文档仅在触发对应场景时继续读取，不做无目的扩展加载。
- 发现索引缺项或路由冲突时先修正索引，不在其他文档新增另一份路由。

## 开发完成检查

- 没有 ESLint 或 Stylelint 警告和错误。
- TypeScript 类型检查通过，没有为规避问题新增 `any`。
- 新增接口均定义入参和返回类型。
- 新增代码符合目录、命名和作用域规范。
- 功能、异常、边界、滚动和视觉状态按改动范围验证。
- 执行 `code-quality.md` 中与本次改动相关的检查命令，并如实说明未执行项及原因。
