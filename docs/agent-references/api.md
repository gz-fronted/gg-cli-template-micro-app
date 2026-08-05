# API 请求规范

## 基础要求

- 接口请求函数统一放在 `src/api/`，按业务模块或后端微服务划分文件。
- 函数命名应表达业务动作，如 `getUserList`、`createOrder`、`downloadReport`。
- 所有接口必须定义请求参数和返回结果类型，公共函数显式声明返回类型。
- 参数、字段、枚举、分页和错误码以接口契约为准，不自行假设统一响应体或自动解包。
- 页面和展示组件不得直接拼装 URL、创建请求实例或维护请求拦截器。

## 请求基础设施

- 默认使用 `@gz-fronted/gz-pc/fetch` 导出的 `gzFetch`。
- 请求客户端只在应用启动阶段配置，业务模块不得重复创建实例。
- 页面组件不得直接使用 Axios，也不得重复维护 Token、错误转换和消息提示。
- gzFetch 的初始化、Token、请求参数、响应和错误规则见 `gz-fetch.md`。

## React 请求状态

组件和自定义 Hook 默认使用 `@gz-fronted/gz-pc/hooks` 导出的 `useRequest` 管理
loading、data、error、取消、防抖、节流、轮询和依赖刷新。

- 操作类请求必须把对应 loading 传递给触发按钮或使用等价禁用保护，避免重复提交。
- 保存、发布、删除和下载等不同操作使用独立的请求状态，不共享一个通用 loading。
- 只有 `useRequest` 明确不适用时才自行维护状态，并说明原因。

## Mock 协同

新增或调整接口时，同步核对声明式 Mock：

1. 定义请求和响应类型。
2. 在 `src/api/` 实现真实 gzFetch 请求函数。
3. 根据接口文档在根目录 `mock/` 生成代表性数据。
4. 在 `mock/index.ts` 注册模块。
5. 分别验证 Mock mode 和真实接口 mode。

业务 Mock 规范见 `mock.md`；只有维护底层 Runtime 时才读取 `mock-runtime.md`。
