# API 请求规范

## 1. 基础要求

- 所有接口请求函数统一放在 `src/api/` 目录。
- 按业务模块或后端微服务划分接口文件。
- 接口函数命名应见名知意，如 `getUserList`、`createOrder`。
- 所有接口必须定义请求参数和返回结果的 TypeScript 类型。
- 公共 API 函数应显式声明返回类型。

## 2. 统一响应体

在请求层定义统一响应体泛型，例如：

```ts
interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}
```

具体字段以后端最终接口约定为准。

## 3. 请求基础设施

- Axios 二次封装放在 `src/utils/request/`。
- 请求封装包括拦截器配置和统一错误处理。
- 页面组件不得直接重复实现 Axios 配置。
