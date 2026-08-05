# 声明式 Mock 开发规范

业务开发只维护接口契约和声明式 Mock，不直接编写 MSW Worker、Handler 或
HttpResponse。底层实现见 `mock-runtime.md`，普通业务 Mock 任务不需要读取。

## 环境和目录

| 命令                 | Vite mode   | Mock   |
| -------------------- | ----------- | ------ |
| `npm run dev`        | development | 不启用 |
| `npm run mock`       | mock        | 启用   |
| `npm run build:sit`  | sit         | 不启用 |
| `npm run build:prod` | production  | 不启用 |

`.env.mock` 使用：

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCK=true
```

`VITE_USE_MOCK` 严格等于字符串 `true` 时才启动。Mock mode 只改变响应来源，不改变
组件和 `src/api/*` 的调用方式。

```text
mock/
├── index.ts
└── example.ts

src/mock/
├── browser.ts
├── runtime.ts
└── runtime.test.ts
```

根目录 `mock/` 存放业务声明和数据；`src/mock/` 只存放通用 Runtime。

## Mock Key

格式：

```text
/pathname.method
```

示例：

```ts
'/user/list.post';
'/user/:id.get';
'/file/download.post';
```

- Path 必须以 `/` 开头，除根路径外不以 `/` 结尾。
- Method 使用小写，当前支持 `get`、`post`、`put`、`delete`。
- Key 不包含 Host、`VITE_API_BASE_URL`、Query 或末尾 `/`。
- 动态路径参数使用 `:参数名`。
- 非法 Key 和重复 Key 必须在创建 Handler 时直接报错。

## 固定响应

```ts
import { defineMock } from '@/mock/runtime';

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

字段统一使用 `res`，不使用 `data`、`response` 或 AxiosResponse。需要无延迟时可显式
配置 `mockTime: 0`。

## 动态响应和 Store

参数影响响应时使用 Resolver：

```ts
'/user/:id.get': ({ params, query }) => ({
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
- `store`：Mock Runtime 的内存状态 Map。

优先级：

1. 默认使用固定响应。
2. 参数影响结果时使用 Resolver。
3. 只有新增、修改或删除需要影响后续请求时才使用 Store。

Mock Store 与 Zustand 完全独立，不持久化到 localStorage，刷新后重置。不要在 Mock 中
重新实现完整后端。

## 错误、Blob 和 Headers

错误场景使用接口文档定义的 Status 和响应体，不虚构错误码：

```ts
'/example/error.get': {
  status: 500,
  res: {
    msg: '服务异常',
  },
}
```

文件响应：

```ts
'/file/download.post': {
  res: new Blob(['content'], { type: 'text/plain;charset=utf-8' }),
  headers: {
    'Content-Disposition': 'attachment; filename="example.txt"',
  },
}
```

## 根据接口文档生成 Mock

获得产品或接口文档后，Agent 默认：

1. 根据 URL 和 Method 生成 Key。
2. 根据请求、响应类型生成固定响应或 Resolver。
3. 使用 `satisfies` 校验代表性数据的业务类型。
4. 覆盖文档已定义的成功、失败、空数据、分页边界和长文本场景。
5. 保持 ID、日期和关联字段一致，使用确定性数据。
6. 不使用真实手机号、证件号、Token 或账号。
7. 需要连续 CRUD 状态时才使用 Store。
8. 将模块加入 `mock/index.ts` 并验证 `npm run mock`。

只有产品语义、枚举含义、字段关联、敏感数据、错误协议或状态变化无法确定时才询问。
不得为了丰富数据虚构状态、字段、按钮或业务流程。

## 未匹配请求和禁止事项

开发环境未匹配的 Mock 请求使用 `bypass`，继续访问真实接口，以支持 Mock 与真实联调
并存。测试环境使用 `error`，防止错误 Key 被静默放行。

- 不在业务 Mock 文件直接导入 MSW。
- 不手写 Worker、Handler 或 HttpResponse。
- 不在普通 `npm run dev` 中启用 Mock。
- 不把 Mock 状态写进 Zustand。
- 不给每个接口重复实现 Runtime 已提供的延迟和响应转换。
- 不把具体业务示例写入脚手架通用文档。
