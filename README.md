# 微应用代码模板

基于 React 19、TypeScript 5、Vite 8 和 Garfish 的业务微应用模板，可独立运行，也可作为 Garfish 子应用加载。

## 技术栈

- React 19
- React Router 7
- TypeScript 5
- Vite 8
- Garfish
- Zustand 5
- Axios 1
- Less 4
- `@chenhui996/gg-ui` / Ant Design 6
- AG Grid React Enterprise
- ECharts
- Vitest / Testing Library

## 工程能力

- ESLint、Stylelint、Prettier 代码质量检查
- commitlint 提交信息校验
- Husky、lint-staged 提交前增量检查
- development、test、sit、production 多环境构建
- React Compiler
- 第三方依赖分包和构建产物分析
- 独立运行与 Garfish 子应用运行

## 快速开始

项目使用 npm，并通过 `package-lock.json` 锁定依赖。

```bash
npm install
npm run dev
```

开发服务默认地址：

```text
http://localhost:3001
```

由于 `@garfish/bridge-react-v18` 尚未声明支持 React 19，项目通过 `.npmrc` 中的以下配置兼容安装：

```ini
legacy-peer-deps=true
```

该配置只解决 npm peer dependency 安装冲突，不代表 Garfish bridge 已正式支持 React 19，升级相关依赖时仍需验证子应用挂载、更新和卸载行为。

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build:dev
npm run build:test
npm run build:sit
npm run build:prod

# 测试
npm run test
npm run test:ui
npm run test:coverage

# 代码检查
npm run lint
npm run lint:style
npm run format:check

# 自动修复
npm run lint:style:fix
npm run format

# 构建产物分析
npm run analyze

# 本地预览构建产物
npm run preview
```

## 提交规范

提交信息遵循 Conventional Commits：

```text
feat(scope): 增加功能
fix(scope): 修复问题
docs: 更新文档
refactor: 重构代码
```

Husky 会在提交过程中执行：

- `pre-commit`：使用 lint-staged 检查并格式化暂存文件。
- `commit-msg`：使用 commitlint 校验提交信息。

`.husky/_` 是 Husky 自动生成并忽略的运行目录，仓库只需要维护 `.husky/pre-commit` 和 `.husky/commit-msg`。

## 环境变量

公共默认值位于 `.env`，各环境文件只覆盖存在差异的值。

| 变量                | 用途                                    |
| ------------------- | --------------------------------------- |
| `VITE_ENV`          | 当前业务环境标识                        |
| `VITE_APP_TITLE`    | 应用标题                                |
| `VITE_API_BASE_URL` | 浏览器请求使用的 API 基础地址或代理前缀 |

环境文件：

| 文件               | 对应命令             |
| ------------------ | -------------------- |
| `.env.development` | `npm run dev`        |
| `.env.test`        | `npm run build:test` |
| `.env.sit`         | `npm run build:sit`  |
| `.env.production`  | `npm run build:prod` |

示例：

```dotenv
VITE_API_BASE_URL=/api
```

## 目录结构

以下为当前模板实际提供的主要目录：

```text
src/
├── api/                       # API 请求函数
├── assets/                    # 图片等静态资源
├── components/                # 跨页面公共组件
│   ├── Chart/
│   └── ErrorBoundary/
├── layouts/                   # 页面布局
├── pages/                     # 路由页面
│   └── home/
├── router/                    # React Router 路由配置
├── store/                     # Zustand 全局状态
├── utils/
│   └── request/               # Axios 请求封装
├── main.tsx                   # 独立应用和 Garfish 子应用入口
├── setupTests.ts              # Vitest 测试初始化
├── style.less                 # 全局样式和主题变量
└── vite-env.d.ts              # Vite 环境变量和全局类型
```

后续新增 `hooks/`、`types/` 等目录时，应遵循 `docs/agent-references/project-structure.md`。

## 微应用运行方式

### 独立运行

当 `window.__GARFISH__` 不存在时，`src/main.tsx` 会直接创建 React Root，并使用 `/` 作为路由 basename。

### Garfish 子应用

当应用由 Garfish 加载时，入口通过 `@garfish/bridge-react-v18` 导出 `provider`，主应用可通过 `appInfo.props.globalState` 传递路由 basename、主题等全局状态。

修改微应用入口后，应同时验证：

- 独立运行可以正常渲染。
- Garfish 可以正常挂载子应用。
- 主应用传入的 basename 能正确控制路由。
- 子应用切换后没有遗留监听器、样式或全局状态。

## 项目 Rules

仓库根目录的 `AGENTS.md` 是规范入口。执行任务时：

1. 先阅读 `docs/agent-references/index.md`。
2. 根据任务类型只读取直接相关的规范。
3. 规范未覆盖的内容以现有实现和需求为准。
4. 完成开发后执行与改动相关的 lint、类型检查、测试或构建。

例如，工程配置任务读取：

```text
docs/agent-references/tooling.md
docs/agent-references/code-quality.md
```

React 页面任务读取：

```text
docs/agent-references/react.md
docs/agent-references/typescript.md
docs/agent-references/styling.md
docs/agent-references/project-structure.md
```

## 开发约定

- 默认使用 `@chenhui996/gg-ui`，缺少所需组件时再使用 Ant Design。
- 业务表格默认使用 AG Grid React Enterprise。
- 页面私有组件、Hooks 和状态遵循就近原则。
- 跨页面共享状态放入 `src/store`。
- API 请求统一通过 `src/utils/request`。
- 避免使用 `any` 规避类型问题。
