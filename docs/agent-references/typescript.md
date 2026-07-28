# TypeScript 开发规范

## 1. 命名规范

- Interface 和 Type Alias 使用 PascalCase。
- 不使用 `I` 或 `T` 作为类型前缀。
- Enum 及其成员使用 PascalCase。
- 推荐使用字符串枚举。

```ts
enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}
```

## 2. interface 与 type

- 对象结构和组件 Props 默认使用 `interface`。
- 联合类型、交叉类型和映射类型使用 `type`。

```ts
interface User {
  id: string;
  name: string;
}

type ID = string | number;
```

## 3. Props 类型

- 每个组件必须定义 Props 接口。
- Props 接口命名为 `[ComponentName]Props`。
- 可选属性使用 `?` 标记，并提供合理默认值。
- 避免在函数签名中直接声明庞大的内联类型。

## 4. 事件类型

- 使用 React 内置事件类型。
- 避免使用 `any`。

```tsx
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};
```

## 5. 函数与变量

- 公共函数、API 函数和复杂业务函数推荐显式声明返回类型。
- 简单变量优先使用 TypeScript 自动类型推导。

## 6. 类型断言

- 尽量避免使用类型断言。
- 优先通过准确类型定义或类型守卫解决类型问题。

## 7. 工具类型

- 合理使用 `Partial`、`Required`、`Readonly`、`Pick`、`Omit` 等工具类型。
- 减少重复类型定义。
