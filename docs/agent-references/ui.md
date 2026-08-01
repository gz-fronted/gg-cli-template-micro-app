# UI 开发规范

产品文档决定业务逻辑，UI 设计稿决定布局、尺寸、间距、颜色和组件状态。实现前必须检查
设计稿，不得仅凭组件默认样式完成页面。

## 页面布局

- 页面默认 `padding: 8px`，相邻主要模块默认 `gap: 8px`。
- 页面根容器使用 `height: 100%`、`min-height: 0` 和纵向 Flex 高度链。
- 可伸缩区域使用 `flex: 1`、`min-width: 0`、`min-height: 0`。
- 不使用 `100vh` 或 `calc(100vh - xxx)` 模拟主应用可用高度。
- 内容超出时必须保留滚动能力，并明确页面滚动或组件内部滚动，避免双滚动条。
- 查询条件空间不足时允许换行，按钮区域必须保持完整可见。

## Panel

- 业务 Panel 默认 `border-radius: 8px`。
- 默认不展示额外 Border，主要通过背景层级、间距和圆角区分。
- 同一边界只允许一个元素绘制分割线，不得出现父子 Border、Shadow 或伪元素叠加。

## 查询表单

- Label 与控件默认间距为 `8px`，并保持垂直居中。
- Label 默认颜色为 `rgba(255, 255, 255, 0.65)`。
- 普通 Input、Select 和 DatePicker 默认 `160px × 32px`；特殊宽度必须来自设计稿。
- 同一页面同类控件高度必须一致。
- 输入框默认 `autoComplete="off"`，除非业务明确需要浏览器历史记录。
- 搜索图标优先使用组件内置能力，不得重复放置独立图标。
- 搜索请求根据业务场景使用防抖，避免无意义的高频请求。
- 必须检查 Placeholder、禁用、只读、Hover、Focus、清除按钮和图标垂直位置。
- 禁用控件使用项目统一视觉，不得通过降低整个表单 opacity 表示禁用。

## Button 与 Tooltip

应用组件配置层统一关闭中文按钮自动插空格：

```tsx
<ConfigProvider button={{ autoInsertSpace: false }}>{children}</ConfigProvider>
```

- 纯图标按钮必须提供明确操作名称的 Tooltip。
- 文本按钮含义清晰时不重复增加 Tooltip。
- 省略文本仅在实际溢出时展示 Tooltip，内容必须等于完整原始值。
- Tooltip 不得长期保持打开或遮挡主要操作区域。

## 列表标题

列表和 Panel 标题默认：

```less
font-size: 14px;
font-weight: 500;
color: rgba(255, 255, 255, 0.85);
```

## AG Grid

- 外层容器默认 `border-radius: 8px` 和 `overflow: hidden`。
- 默认 `headerHeight={32}`、`rowHeight={28}`，除非设计稿明确要求其他高度。
- 使用 `@ag-grid-community/locale` 当前版本支持的中文语言包，底部分页所有可见文案必须
  中文化，不能只修改空状态。
- 行状态使用团队标准基础色 `#FFE7CB`：
  - Hover：`rgba(255, 231, 203, 0.15)`
  - Selected：`rgba(255, 231, 203, 0.12)`
  - Hover + Selected：`rgba(255, 231, 203, 0.26)`
- 固定列 Hover 和 Selected 背景必须与同一数据行其他列一致。
- 操作列表头和内容左对齐，内容左侧间距默认 `8px`。
- 列宽不足时保留横向滚动，不得无条件压缩所有列。
- 固定列、短分割线和文本溢出的实现细则见 `ag-grid.md`。

## Drawer

- Drawer 应铺满当前应用可用区域，兼容独立运行和 Garfish 嵌入。
- Root、Wrapper、Content 使用完整 `height: 100%` 高度链。
- Header 和 Footer 是否存在由产品决定；存在时固定，Body 使用 `flex: 1`、
  `min-height: 0` 并独立滚动。
- Mask 颜色和透明度优先读取设计稿或统一主题 Token，不得使用不透明纯黑，也不得给
  整个 Drawer 设置 opacity。
- Drawer 样式通过组件属性或局部 rootClassName 限定作用域，不得全局污染。

## 视觉验收

开发完成后至少检查：

- 页面 Padding、模块间距、Panel 圆角和 Border。
- 控件尺寸、Label 样式、Button 文案和交互状态。
- 正常宽度、窗口缩小、控制台打开和内容超出后的滚动。
- AG Grid 行高、分页中文、Hover、Selected、固定列、分割线和横向滚动。
- Drawer 高度链、Body 滚动和 Mask。
- 实际运行页面与设计稿仍存在的偏差。
