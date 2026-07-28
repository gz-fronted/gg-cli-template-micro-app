# 项目目录结构规范

## 1. 根目录

```text
├── .env.development
├── .env.test
├── .env.production
├── .eslintrc.cjs
├── .prettierrc
├── .editorconfig
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── docs
└── src/
```

## 2. src 目录

```text
src/
├── api/
├── assets/
├── components/
├── hooks/
├── layouts/
├── pages/
├── router/
├── store/
├── types/
├── utils/
├── main.tsx
├── App.tsx
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
- 每个组件使用独立目录。
- 入口文件使用 `index.tsx`。
- 样式优先使用 `index.module.less`。

### hooks/

- 存放全局复用的自定义 Hooks。
- 文件名必须以 `use` 开头。
- 使用 camelCase。

### layouts/

- 存放页面整体布局组件。
- 布局组件可作为路由父级组件并配合 `<Outlet />` 使用。

### pages/

- 存放与路由直接对应的页面。
- 按功能模块划分目录。
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
- `request/` 用于 Axios 二次封装。
