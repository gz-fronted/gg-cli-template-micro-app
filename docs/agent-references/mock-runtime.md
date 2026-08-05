# Mock Runtime 维护规范

本文仅用于修改 `src/mock/` 通用 Runtime、MSW 集成或 Runtime 测试。普通业务 Mock
开发只读取 `mock.md`。

## Runtime 职责

Runtime 负责：

- 解析并校验 `/pathname.method`。
- 匹配 Method、Path Params、Query 和 JSON Body。
- 应用默认 Status、延迟和 Headers。
- 把固定配置或 Resolver 转换为 MSW Handler。
- 处理 JSON 和 Blob 响应。
- 提供与 Zustand 隔离的内存 Store。
- 拒绝非法及重复 Key。
- 让浏览器开发环境中的未匹配请求 bypass。

业务 Mock 文件不得感知 Worker、Handler 或 HttpResponse。

## 公共契约

```ts
interface MockConfig<TResponse> {
  res: TResponse;
  status?: number;
  mockTime?: number;
  headers?: Record<string, string>;
}

interface MockRequest {
  raw: Request;
  params: PathParams;
  query: URLSearchParams;
  store: Map<string, unknown>;
  json: <TBody = unknown>() => Promise<TBody>;
}
```

默认值必须使用空值合并，保证 `mockTime: 0` 有效：

```ts
const status = config.status ?? 200;
const mockTime = config.mockTime ?? 500;
```

修改公共契约时必须同步更新类型、业务示例、测试和相关文档。

## 启动和隔离

- 应用在渲染前等待同一个 Mock 启动 Promise，避免首个请求漏过 Handler。
- 非 Mock mode 的启动函数立即返回，不静态打包浏览器 Worker。
- 独立运行和 Garfish 生命周期复用相同启动逻辑。
- 浏览器使用 `setupWorker` 和 `onUnhandledRequest: 'bypass'`。
- Vitest 使用 `setupServer` 和 `onUnhandledRequest: 'error'`。
- 每个测试结束后调用 `resetMockStore()`，并按测试框架要求重置 Handler。

## 测试要求

Runtime 修改至少覆盖受影响的以下能力：

- 非法和重复 Key。
- 默认及自定义 Status、mockTime，尤其是 `mockTime: 0`。
- GET、POST、PUT、DELETE。
- Path Params、Query 和 JSON Body。
- 固定响应和异步 Resolver。
- Store 连续状态和测试间重置。
- 错误响应、Headers 和 Blob。
- 未匹配请求的浏览器 bypass 与测试 error 策略。

执行：

```bash
npm run test -- --run
npm run typecheck
npm run lint
```

## 变更边界

- 不为单个业务接口修改 Runtime 公共行为。
- 不在 Runtime 中引入业务字段、枚举或数据。
- 不静默接受非法 Key、重复 Key或未知 Method。
- 不把 Mock Store 持久化，也不与应用 Zustand 共用状态。
- 新能力只有在多个业务场景可复用且已有测试时才进入 Runtime。
