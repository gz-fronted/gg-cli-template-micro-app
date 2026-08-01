# React 开发规范

## 1. 组件开发规范

### 1.1 组件定义

- 统一使用函数组件 (Function Component)，不使用 Class Component。
- 使用 `React.FC` 定义组件类型。
- 使用 `Props`：不直接在函数参数处解构 props，而是在函数内部解构赋值。

```tsx
import React from 'react';

interface UserCardProps {
  name: string;
  age?: number;
}

export const UserCard: React.FC<UserCardProps> = (props) => {
  const { name, age = 18 } = props;

  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};
```

### 1.2 命名规范

- 路由页面目录使用小写中划线（kebab-case），如 `audit-log/`、`user-center/`。
- React 组件文件使用 PascalCase，如 `UserProfile.tsx`。
- React 组件目录使用 PascalCase，如 `UserProfile/`、`SearchForm/`，入口文件使用
  `index.tsx`。
- 页面目录和组件目录必须按职责区分，不得把页面目录写成 PascalCase，也不得把组件
  目录写成小写中划线。
- 组件内部变量和函数使用 camelCase。
- 传递给组件的事件 Props 命名为 `onXxx`。
- 组件内部事件处理函数命名为 `handleXxx`。

### 1.3 组件结构与拆分

- 遵循单一职责原则。
- 组件逻辑复杂时，应拆分为更小的子组件。
- 尽量保持 UI 组件纯粹。
- 复杂业务逻辑和数据获取应抽离到自定义 Hook 或容器组件中。

## 2. Hooks 使用规范

### 2.1 基础 Hooks

- `useState` 用于管理组件内部简单状态。
- 复杂状态可考虑 `useReducer` 或 Zustand。
- `useEffect` 必须明确声明依赖数组。
- 避免在单个 `useEffect` 中执行过多不相关逻辑。
- 定时器、事件监听器等副作用必须清理。

### 2.2 性能优化 Hooks

- 谨慎使用 `useMemo` 和 `useCallback`。
- 仅在存在性能瓶颈或需要稳定引用时使用。
- 项目引入 React Compiler 后，手动使用这些 Hook 的场景应减少。

### 2.3 自定义 Hooks

- 命名必须以 `use` 开头。
- 返回数组或对象，根据实际场景决定。
