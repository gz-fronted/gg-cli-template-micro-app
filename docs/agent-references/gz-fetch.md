# gzFetch 使用规范

本文说明业务项目如何使用 `@gz-fronted/gz-pc/fetch`。依赖版本和最终 API 以项目
`package.json`、锁文件及已安装包类型为准；仅在 API 或行为变化时更新本文。

## 导入和初始化

统一从子路径导入：

```ts
import { configureGzFetch, GzFetchFeedbackProvider, gzFetch } from '@gz-fronted/gz-pc/fetch';
import { useRequest } from '@gz-fronted/gz-pc/hooks';
```

不得从包根入口导入。应用启动阶段只配置一次，Garfish 重新挂载时可以覆盖上次配置：

```ts
configureGzFetch({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  getToken: () => useGlobalStore.getState().token ?? undefined,
  showErrorMessage: true,
  unauthorized: {
    enabled: true,
  },
});
```

模板在 `src/bootstrap/configure-request.ts` 中默认开启统一 401 处理。业务模块不得自行创建请求
实例。如果在配置前调用 gzFetch，应视为初始化错误。

请求反馈需要处于 gg-ui 主题上下文中。模板已在 `AppThemeProvider` 的 `ConfigProvider` 内挂载
`GzFetchFeedbackProvider`，业务页面不需要重复接入：

```tsx
<ConfigProvider themeMode={themeMode}>
  <GzFetchFeedbackProvider>{children}</GzFetchFeedbackProvider>
</ConfigProvider>
```

不要把 Provider 移到 `ConfigProvider` 外，否则 Modal 和 message 无法可靠继承当前主题。

## Token 和环境变量

`getToken` 在每次请求前动态执行。请求层只从统一 Store 读取 Token：

- 独立运行时，入口负责把持久化 Token 初始化到 Store。
- Garfish 嵌入时，入口负责把主应用状态同步到 Store。
- gzFetch 不直接读取 localStorage、React Context 或主应用 Props。
- 公开接口使用 `skipAuth: true`，不得通过传空 Token 模拟公开请求。

环境变量职责：

- `VITE_API_BASE_URL`：后端 API 基础路径。
- `VITE_API_SERVER`：当前前端应用部署地址，不得用作 gzFetch baseURL 或 Vite Proxy
  target。

## 请求调用

统一使用配置对象形式：

```ts
interface UserQuery {
  id: string;
}

interface UserDetail {
  id: string;
  name: string;
}

export const getUser = (params: UserQuery): Promise<UserDetail> =>
  gzFetch<UserDetail, UserQuery>({
    url: '/user/detail',
    method: 'GET',
    params,
  });
```

- 第一个泛型是响应数据类型，第二个泛型是请求参数类型。
- Method 使用大写 `GET`、`POST`、`PUT`、`DELETE`。
- GET、DELETE 的 `params` 映射为 URL Query。
- POST、PUT 的 `params` 映射为 Request Body。
- 不使用 Axios 的 `data` 字段，不混用配置对象和快捷方法。

单次请求可按已安装版本的类型使用 `headers`、`timeout`、`showErrorMessage`、
`skipAuth`、`responseType`、`signal` 和 `withCredentials`。不得把未开放的 Axios 配置强行
传入。

## 响应和错误

当前请求核心默认把所有 HTTP `2xx` 状态视为成功。成功时直接返回后端原始
`response.data`，不会：

- 返回 AxiosResponse。
- 判断业务 `code`。
- 自动解包 `data`。
- 转换分页、字段或日期。

是否存在统一业务响应体及如何解包，以接口契约为准，并在业务 API 层显式体现。

统一错误类型包括：

```text
HTTP_ERROR
NETWORK_ERROR
TIMEOUT_ERROR
CANCELED_ERROR
UNKNOWN_ERROR
```

HTTP 错误优先读取响应体 `msg`，否则使用默认文案。错误提示默认开启；页面需要自行展示
错误时，在单次请求设置 `showErrorMessage: false`，避免重复提示。取消请求默认不展示
错误消息。普通业务模块不应再次调用 `message.error` 展示同一个请求错误。

## HTTP 401

`gz-pc` 的 401 能力默认关闭，但本模板在应用初始化层显式开启。HTTP 401 的处理链路为：

1. gzFetch 捕获 401，不再展示普通错误 message。
2. 全局共享的 401 管理器只接受首个请求，多个请求或多个 gzFetch 实例不会重复弹窗。
3. `GzFetchFeedbackProvider` 在当前 gg-ui `ConfigProvider` 上下文内展示登录失效 Modal。
4. 用户确认后优先调用 `onUnauthorized`；未提供时跳转到 `loginUrl`。
5. Modal 关闭完成后释放状态，后续独立发生的 401 可以再次弹窗。

公共默认值如下：

```ts
{
  enabled: false,
  loginUrl: '/login',
  modalTitle: '登录失效',
  modalMessage: '当前登录状态已失效，请重新登录。',
}
```

普通项目使用模板配置即可。SSO、主应用统一登录或需要先清理业务状态时，只在
`configureRequest` 中覆盖：

```ts
configureGzFetch({
  unauthorized: {
    enabled: true,
    modalTitle: '登录状态已过期',
    modalMessage: '请重新登录后继续使用。',
    onUnauthorized: () => {
      // 在此执行宿主应用约定的退出或登录逻辑。
    },
  },
});
```

传入 `onUnauthorized` 后不会再执行默认 `loginUrl` 跳转。只需要自定义登录地址时设置
`loginUrl`，不要同时配置无必要的回调。Garfish 子应用的登录行为若由主应用负责，应按主应用
契约提供 `onUnauthorized`，不能假设子应用的 `/login` 一定属于正确宿主路由。

## 文件响应和取消

下载接口显式声明响应类型：

```ts
const file = await gzFetch<Blob, DownloadParams>({
  url: '/file/download',
  method: 'POST',
  params,
  responseType: 'blob',
});
```

需要取消请求时传入标准 `AbortSignal`，并按 `CANCELED_ERROR` 处理，不通过组件卸载后的
布尔标记模拟取消。

## 禁止事项

- 不在页面组件直接调用 Axios。
- 不在业务模块重复配置 baseURL、Token、拦截器和消息提示。
- 不假设所有后端都有相同的业务响应体。
- 不为了兼容单个接口修改全局请求核心；通用能力应在 gz-pc 中统一扩展。
