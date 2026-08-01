# API 请求规范

## 1. 基础要求

- 所有接口请求函数统一放在 `src/api/` 目录。
- 按业务模块或后端微服务划分接口文件。
- 接口函数命名应见名知意，如 `getUserList`、`createOrder`。
- 所有接口必须定义请求参数和返回结果的 TypeScript 类型。
- 公共 API 函数应显式声明返回类型。

## 2. 请求基础设施

- 业务项目默认使用 `@gz-fronted/gz-pc/fetch`。
- 请求客户端只在应用启动阶段进行一次必要配置，业务模块不得重复创建请求实例。
- 页面组件不得直接使用 Axios，也不得自行重复维护请求拦截器和错误转换。
- 后端是否包含统一业务响应体、是否需要解包，以接口契约为准，不得自行假设。

## 3. React 请求状态

组件和自定义 Hook 默认使用 `@gz-fronted/gz-pc/hooks` 导出的 `useRequest` 管理
loading、data、error、取消、轮询和防抖等请求状态。

操作类接口必须把对应 loading 传递给触发按钮，避免重复提交。不同操作使用各自独立的
loading 状态。

## 4. gzFetch 与 Mock

初始化、Token 注入、配置对象式调用、参数映射、响应错误、声明式 Mock 和 AI 生成规则
统一见：

```text
docs/agent-references/gz-fetch-and-mock.md
```
