# 样式开发规范

## 基础规则

- 统一使用 Less，页面和组件样式优先使用 `*.module.less`。
- 避免全局样式污染，条件类名使用项目已有的 className 工具。
- 设计稿明确的值优先于组件默认样式；稳定团队值应优先沉淀为 Token 或公共配置。
- 不通过覆盖层、重复边框、额外伪元素或隐藏滚动条掩盖结构问题。

## CSS Modules 命名

本地类名和状态类统一使用 camelCase：

```less
.userProfileContainer {
  min-width: 0;
}

.isActive {
  color: #fff;
}
```

静态引用使用点语法：

```tsx
<div className={styles.userProfileContainer} />
```

不得新增 kebab-case 本地类名，也不得通过 `styles['user-profile-container']` 绕过规范。
只有类名由类型安全变量动态决定时才使用 `styles[className]`。第三方全局类名保持原命名。

## Flex 和 Grid 尺寸链

- 横向可收缩子项根据场景设置 `min-width: 0`。
- 纵向占据剩余高度并内部滚动的区域使用 `flex: 1` 和 `min-height: 0`。
- AG Grid、图表、左右布局和 Drawer 应逐级检查父容器尺寸链。
- 页面高度依赖主应用提供的完整高度链，不使用 `100vh` 或不稳定的
  `calc(100vh - xxx)` 补偿布局。
- 不使用固定大宽度导致页面整体溢出。

## Overflow 和滚动

- 明确页面、Panel、Drawer Body、表格或图表中哪一个容器负责滚动。
- 避免页面滚动和组件内部滚动形成无意的双滚动条。
- 内容超出时保留可访问的滚动能力，不使用 `overflow: hidden` 意外裁剪内容。
- 长文本默认单行省略时，同时提供实际溢出检测和完整内容 Tooltip。
- 修复滚动问题时验证初始状态、滚动到底、滚回顶部和容器尺寸变化后的状态。

## 样式作用域

- 第三方组件覆盖必须位于页面或组件的 CSS Module 根类下。
- `:global(...)` 只包裹需要覆盖的第三方类名，不使用宽泛全局选择器影响其他页面。
- 先在运行页面确认组件版本和实际 DOM 类名，再编写覆盖；不得照搬旧项目前缀或内部类名。
- 相邻边界只允许一个元素负责 Border、Shadow 或伪元素，避免双线和局部加粗。
