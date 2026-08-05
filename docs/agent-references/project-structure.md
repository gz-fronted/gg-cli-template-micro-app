# 项目目录结构规范

## 1. 根目录

```text
├── .env.development
├── .env.mock
├── .env.test
├── .env.sit
├── .env.production
├── .commitlintrc
├── .stylelintrc
├── .prettierrc
├── .editorconfig
├── eslint.config.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── AGENTS.md
├── docs
├── mock/（按需创建）
├── rules/（按需创建）
├── skills/（按需创建）
└── src/
```

根目录结构以当前模板为准。功能目录可以按需创建，不要求保留空目录。

## 2. src 目录

```text
src/
├── api/
├── assets/
├── bootstrap/（按需创建）
├── config/（按需创建）
├── components/
├── hooks/（按需创建）
├── layouts/
├── pages/
├── router/
├── store/
├── types/（按需创建）
├── utils/
├── main.tsx
├── App.tsx（按需创建）
└── vite-env.d.ts
```

## 3. 目录职责

### api/

- 存放接口请求函数。
- 按业务模块或后端微服务划分。
- 必须定义请求参数和返回结果类型。

### assets/

- 存放图片、图标、字体等静态资源。
- 较大资源建议上传 CDN。

### components/

- 存放跨页面复用的公共组件。
- 每个组件使用独立目录，目录名使用 PascalCase，如 `UserProfile/`。
- 入口文件使用 `index.tsx`。
- 样式优先使用 `index.module.less`。

### config/

- 存放与业务无关的应用级默认配置。
- 不得把业务枚举、接口数据或页面列定义放入该目录。

### hooks/

- 存放全局复用的自定义 Hooks。
- 文件名必须以 `use` 开头。
- 使用 camelCase。

### layouts/

- 存放页面整体布局组件。
- 布局组件可作为路由父级组件并配合 `<Outlet />` 使用。

### pages/

- 存放与路由直接对应的页面。
- 按功能模块划分目录，页面目录名使用小写中划线（kebab-case），如 `order-list/`。
- 页面私有组件、Hooks、Store 和工具方法遵循就近原则。
- 页面入口统一使用 `index.tsx`。
- 页面样式优先使用 `index.module.less`。

### router/

- 存放 React Router v7 路由配置。
- 使用 Data API 模式配置路由树。
- 按业务模块拆分，避免单文件过长。

### store/

- 存放 Zustand 全局状态。
- 按业务领域拆分 Store。
- 不存放仅属于单个组件的局部状态。

### types/

- 存放全局共享类型和枚举。
- 文件使用 `*.ts` 或 `*.d.ts`。

### utils/

- 存放通用工具函数和基础设施。
- 不得在业务项目中重复实现 gzFetch 已提供的请求基础设施。

### mock/

- 根目录 `mock/` 存放声明式接口 Mock 配置和 Mock 数据。
- `src/mock/` 只存放通用 Mock Runtime，不存放业务 Mock 数据。
- Mock 文件按业务接口模块划分，Key 使用 `/pathname.method`。

### rules/ 与 skills/

- `rules/` 存放需要由 `AGENTS.md` 明确加载的项目级硬规则。
- `skills/` 存放可复用的专项工作流、诊断经验和必要资源。
- 独立规则文件和项目级 Skill 不会替代 `AGENTS.md`；必须在 `AGENTS.md` 对应任务路由中引用。
- 不把单个页面、接口或业务枚举写入通用 Skill。
