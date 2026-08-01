# 微应用代码模板

基于 React 19、TypeScript 5、Vite 8 和 Garfish 的业务微应用模板，可独立运行，也可作为 Garfish 子应用加载。

## 技术栈

- React 19
- React Router 7
- TypeScript 5
- Vite 8
- Garfish
- Zustand 5
- `@gz-fronted/gz-pc`
- MSW 2
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
- 声明式 Mock mode，未匹配请求自动放行真实接口
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

# Mock 开发
npm run mock

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

| 变量                | 用途                                              |
| ------------------- | ------------------------------------------------- |
| `VITE_ENV`          | 当前业务环境标识                                  |
| `VITE_APP_TITLE`    | 应用标题                                          |
| `VITE_API_BASE_URL` | 后端 API 基础地址或代理前缀                       |
| `VITE_API_SERVER`   | 当前前端项目部署到对应环境 Nginx 后的完整访问地址 |
| `VITE_USE_MOCK`     | 严格等于 `true` 时启用声明式 Mock                 |

环境文件：

| 文件               | 对应命令             |
| ------------------ | -------------------- |
| `.env.development` | `npm run dev`        |
| `.env.mock`        | `npm run mock`       |
| `.env.test`        | `npm run build:test` |
| `.env.sit`         | `npm run build:sit`  |
| `.env.production`  | `npm run build:prod` |

示例：

```dotenv
VITE_API_BASE_URL=/api
```

### VITE_API_SERVER

`VITE_API_SERVER` 是当前前端应用的完整部署地址，不是后端 API 地址：

```dotenv
# dev
VITE_API_SERVER=http://172.16.31.163:8599

# sit
VITE_API_SERVER=http://172.16.31.76:8599
```

`8599` 是脚手架占位端口，项目分配正式端口后必须修改。该变量不得用作 gzFetch
`baseURL` 或 Vite Proxy `target`。

### gzFetch 与 Mock

- API 函数从 `@gz-fronted/gz-pc/fetch` 导入 `gzFetch`。
- React 组件从 `@gz-fronted/gz-pc/hooks` 导入 `useRequest`。
- `npm run dev` 不加载 Mock；`npm run mock` 在应用渲染前启动 Worker。
- Mock Key 使用 `/pathname.method`，默认 `status` 为 `200`、`mockTime` 为 `500`。
- 未匹配 Mock 的请求放行到真实接口。
- Mock Runtime 的 Store 与 Zustand 无关，只用于模拟接口连续状态。

完整规范见
[gz-fetch-and-mock.md](./docs/agent-references/gz-fetch-and-mock.md)。

## 目录结构

以下为当前模板实际提供的主要目录：

```text
src/
├── api/                       # API 请求函数
├── assets/                    # 图片等静态资源
├── bootstrap/                 # 请求与 Mock 启动配置
├── config/                    # 应用级通用默认配置
├── components/                # 跨页面公共组件
│   ├── Chart/
│   ├── ErrorBoundary/
│   └── RouteLoading/
├── layouts/                   # 页面布局
├── mock/                      # 通用 Mock Runtime
├── pages/                     # 路由页面
│   └── home/
├── router/                    # React Router 路由配置
├── store/                     # Zustand 全局状态
├── main.tsx                   # 独立应用和 Garfish 子应用入口
├── setupTests.ts              # Vitest 测试初始化
├── style.less                 # 全局样式和主题变量
└── vite-env.d.ts              # Vite 环境变量和全局类型
```

根目录 `mock/` 存放声明式业务 Mock 配置；模板示例不接入 Home，且默认不会启用。

后续新增 `hooks/`、`types/` 等目录时，应遵循 `docs/agent-references/project-structure.md`。

## 微应用运行方式

### 独立运行

当 `window.__GARFISH__` 不存在时，`src/main.tsx` 会直接创建 React Root，并使用 `/` 作为路由 basename。
独立运行时会先将 localStorage 中的 Token 初始化到 Zustand Store。

### Garfish 子应用

当应用由 Garfish 加载时，入口通过 `@garfish/bridge-react-v18` 导出 `provider`，主应用可通过 `appInfo.props.globalState` 传递路由 basename、主题等全局状态。
Garfish 模式下主应用 Token 会同步到同一个 Store，gzFetch 始终只从 Store 读取 Token。

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
docs/agent-references/ui.md
docs/agent-references/styling.md
docs/agent-references/project-structure.md
```

## 开发约定

- 默认使用 `@chenhui996/gg-ui`，缺少所需组件时再使用 Ant Design。
- 业务表格默认使用 AG Grid React Enterprise。
- 页面私有组件、Hooks 和状态遵循就近原则。
- 跨页面共享状态放入 `src/store`。
- API 请求统一通过 `@gz-fronted/gz-pc/fetch`，组件请求状态使用
  `@gz-fronted/gz-pc/hooks`。
- 提供接口文档后，默认同步生成声明式 Mock；只有业务语义无法确认时才询问。
- 避免使用 `any` 规避类型问题。
