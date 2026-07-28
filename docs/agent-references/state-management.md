# 状态管理规范

- 局部状态优先使用组件内部的 `useState` 或 `useReducer`。
- 全局状态使用 Zustand 5。
- Store 按业务模块划分，如 `useUserStore`、`useAppStore`。
- 只将真正需要跨组件通信的状态放入全局 Store。
- 不要将组件内部状态全部放入全局 Store。
