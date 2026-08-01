# 样式开发规范

## 基础规则

- 统一使用 Less。
- 页面和组件样式优先使用 CSS Modules，命名为 `xxx.module.less`。
- 避免全局样式污染。
- 条件类名优先使用项目已有的 className 工具。

## CSS Modules 命名

CSS Modules 中的类名统一使用小驼峰，例如：

```less
.userProfileContainer {
  min-width: 0;
}
```

对应代码：

```tsx
<div className={styles.userProfileContainer} />
```

禁止在 CSS Modules 中新增 kebab-case 类名，也不得通过
`styles['user-profile-container']` 绕过命名规范。第三方组件原有的全局类名不受此规则
限制。

## Flex 尺寸约束

- 需要收缩的 Flex 或 Grid 子项应根据场景设置 `min-width: 0`。
- 需要占据剩余高度并在内部滚动的区域应使用 `flex: 1` 和 `min-height: 0`。
- 页面高度优先依赖主应用提供的完整高度链，不使用 `100vh` 或不稳定的
  `calc(100vh - xxx)`。

## Overflow 与滚动

- 页面级滚动和组件内部滚动必须明确，避免双滚动条。
- 长文本默认单行省略时，应同时提供实际溢出检测和完整内容 Tooltip。
- 不得通过隐藏滚动条、裁剪内容或固定大宽度掩盖布局问题。

## 样式作用域

- 第三方组件样式覆盖必须位于页面或组件的 CSS Module 根类下。
- `:global` 只包裹需要覆盖的第三方类名，不得使用宽泛全局选择器影响其他页面。
