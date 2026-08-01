# gzFetch 与 Mock Mode 使用规范

本文说明业务项目如何使用 `@gz-fronted/gz-pc` 和声明式 Mock。业务开发只需要接口
定义和简化配置，不需要了解 MSW Worker、Handler 或 HttpResponse。

## 依赖与导入

依赖版本由项目 `package.json` 和锁文件统一维护，本文档不固定具体版本号。正常依赖升级
不得要求同步修改调用规范文档，只有 API 或行为发生变化时才更新本规范。

统一从子路径导入：

```ts
import { gzFetch } from '@gz-fronted/gz-pc/fetch';
import { useRequest } from '@gz-fronted/gz-pc/hooks';
```

不得从包根入口导入，也不得在业务模块重复创建请求实例。

## 环境与启动

| 命令                 | Vite mode   | Mock   |
| -------------------- | ----------- | ------ |
| `npm run dev`        | development | 不启用 |
| `npm run mock`       | mock        | 启用   |
| `npm run build:sit`  | sit         | 不启用 |
| `npm run build:prod` | production  | 不启用 |

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCK=true
```

- `VITE_API_BASE_URL` 是后端 API 基础路径。
- `VITE_USE_MOCK` 严格等于 `true` 时才启用 Mock。
- `VITE_API_SERVER` 是当前前端应用的部署地址，不得用作请求 baseURL、Vite Proxy
  target 或 Mock Key。

`main.tsx` 在渲染前调用 `await enableMock()`。普通模式下该函数立即返回；Mock 模式
动态加载 MSW 并等待 Worker 启动，避免首个请求漏过 Mock。

## gzFetch 初始化

应用启动时只配置一次：

```ts
configureGzFetch({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  getToken: () => useGlobalStore.getState().token ?? undefined,
});
```

请求层始终只从 Zustand Store 获取 Token：

- 独立运行时，入口从 localStorage 初始化 Store。
- Garfish 嵌入时，入口把主应用 globalState 同步到 Store。
- gzFetch 不直接读取 localStorage 或主应用 Props。

## API 调用

```ts
export const getUser = (params: UserQuery): Promise<UserDetail> =>
  gzFetch<UserDetail, UserQuery>({
    url: '/user/detail',
    method: 'GET',
    params,
  });
```

业务代码统一使用配置对象形式。GET、DELETE 的 `params` 会映射为 URL Query，
POST、PUT 的 `params` 会映射为 Request Body，不得使用 Axios 的 `data` 字段。

组件默认使用 `useRequest` 管理请求状态，不自行重复维护 loading、data 和 error。

## 目录

```text
mock/
├── index.ts
└── example.ts

src/
├── bootstrap/enable-mock.ts
└── mock/
    ├── browser.ts
    └── runtime.ts

public/
└── mockServiceWorker.js
```

根目录 `mock/` 存放业务声明；`src/mock/` 只存放通用 Runtime。

## Mock Key

Key 格式：

```text
/pathname.method
```

示例：

```ts
'/user/list.post';
'/user/:id.get';
'/file/download.post';
```

Method 使用小写，支持 `get`、`post`、`put`、`delete`。Key 不包含
`VITE_API_BASE_URL`、Host、Query 或末尾 `/`。

## 固定响应

```ts
export default defineMock({
  '/example/ping.get': {
    res: {
      message: 'pong',
    },
  },
});
```

默认值：

```text
status: 200
mockTime: 500
```

覆盖默认值：

```ts
'/example/error.get': {
  status: 500,
  mockTime: 1000,
  res: {
    message: '服务异常',
  },
}
```

字段统一使用 `res`，不使用 `response`。

## 动态响应和状态

```ts
'/user/:id.get': ({ params, query, json, store }) => ({
  res: {
    id: params.id,
    keyword: query.get('keyword'),
  },
})
```

Resolver 可读取：

- `raw`：原始 Request。
- `params`：Path Params。
- `query`：URLSearchParams。
- `json<T>()`：请求 Body。
- `store`：Mock Runtime 独立状态 Map。

Mock Store 与项目 Zustand 完全独立，只用于模拟后端状态。它不会持久化到 localStorage，
刷新页面后重置，测试间使用 `resetMockStore()` 清理。

需要模拟新增、修改或删除时，可以在 Resolver 中读写 Store；简单查询接口不必使用。

## Blob 和 Headers

```ts
'/file/download.post': {
  res: new Blob(['content'], { type: 'text/plain;charset=utf-8' }),
  headers: {
    'Content-Disposition': 'attachment; filename="example.txt"',
  },
}
```

## 未匹配请求

Worker 使用：

```ts
onUnhandledRequest: 'bypass';
```

未匹配 Mock Key 的请求继续访问真实接口。不得为了启用 Mock 而统一拦截全部请求。

## 根据接口文档默认生成 Mock

当开发者提供产品文档或接口文档时，Agent 默认完成以下工作，不要求开发者学习 Mock
Runtime：

1. 根据 URL 和 Method 生成 `/pathname.method` Key。
2. 根据请求、响应类型生成静态响应或 Resolver。
3. 生成符合字段类型和已确认枚举的代表性数据。
4. 覆盖成功、失败、空数据、分页边界和长文本等文档已定义场景。
5. 需要 CRUD 连续状态时使用 Mock Store。
6. 将模块加入 `mock/index.ts`。
7. 补充必要的 Runtime 或 API 测试。

只有产品语义、枚举含义、字段关联、敏感数据或状态变化无法从文档确定时才询问。
不得为了丰富数据而虚构状态、字段、按钮或业务流程。

## 禁止事项

- 不在业务 Mock 文件直接导入 MSW。
- 不手写 Worker、Handler 或 HttpResponse。
- 不把审计日志等具体业务数据写入模板。
- 不在普通 `npm run dev` 中启用 Mock。
- 不把 Mock 数据写进 Zustand。
- 不给每个接口重复实现延迟、状态码和响应转换逻辑。
