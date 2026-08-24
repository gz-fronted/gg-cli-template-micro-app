# UI 开发规范

产品文档决定业务逻辑，接口文档决定数据契约，UI 设计稿决定布局、尺寸、间距、颜色和
组件状态。模板默认值用于设计稿未明确的场景；设计稿明确时以设计稿为准。

## 开发前提取

编码前只提取本次任务相关的视觉参数：

- 页面可用区域、高度链和滚动归属。
- Padding、模块间距、Panel 圆角和边界。
- 表单控件尺寸、Label、禁用、只读和交互状态。
- 标题、按钮、图标和 Tooltip。
- Drawer、表格、分页或其他复杂组件的尺寸与状态。
- 常规宽度、窗口缩小和内容超出时的响应方式。

未确认的业务状态不得仅根据视觉稿自行补充。

## 页面布局

- 模板页面默认 `padding: 8px`，相邻主要模块默认 `gap: 8px`。
- 根容器使用 `height: 100%`、`min-height: 0` 和纵向 Flex 高度链。
- 可伸缩区域使用 `flex: 1`、`min-width: 0`、`min-height: 0`。
- 不使用 `100vh` 或 `calc(100vh - xxx)` 模拟主应用可用高度。
- 明确页面滚动或内部滚动，内容超出时不得裁剪，避免双滚动条。
- 查询条件空间不足时允许换行，操作按钮区域保持完整可见。

## Panel 和边界

- 模板业务 Panel 默认 `border-radius: 8px`。
- 默认不展示额外 Border，主要通过背景层级、间距和圆角区分。
- 同一边界只由一个元素绘制，不叠加父子 Border、Shadow 或伪元素。
- 出现局部粗线、双线或断线时先检查边界所有者，不通过遮挡修复。

## 查询表单

- Label 与控件默认间距 `8px`，并保持垂直居中。
- Label 默认颜色使用 `var(--gz-color-text-secondary)`。
- 普通 Input、Select 和 DatePicker 默认 `160px × 32px`；特殊尺寸来自设计稿。
- 同一页面同类控件高度保持一致，表单项宽度应有明确规则。
- 输入框默认 `autoComplete="off"`，除非业务需要浏览器历史记录。
- 搜索图标优先使用组件内置能力，不重复放置。
- 搜索请求按业务场景使用防抖或节流，不对多选等复杂交互盲目自动请求。

必须检查普通、有值、空值、禁用、只读、Hover、Focus 和错误状态，以及 Placeholder、
清除按钮和图标位置。禁用控件使用统一视觉，不通过降低整个表单 opacity 表示禁用。

日期等浮层组件还要检查当前值、非当前范围、Hover、选中、区间和今天等状态的优先级；
不得给整个单元格设置 opacity 而影响背景、描边或交互状态。

## Button 和 Tooltip

应用配置层统一关闭中文按钮自动插入空格：

```tsx
<ConfigProvider button={{ autoInsertSpace: false }}>{children}</ConfigProvider>
```

- 纯图标按钮提供明确操作名称的 Tooltip。
- 文本按钮含义清晰时不重复增加 Tooltip。
- 禁用按钮需要解释时，可用 Tooltip 展示原因。
- 省略文本只在实际溢出时展示完整原始值。
- Tooltip 不长期保持打开，不遮挡主要操作区域。

## 标题

列表和 Panel 标题默认：

```less
font-size: 14px;
font-weight: 500;
color: var(--gz-color-text);
```

## AG Grid

业务表格默认使用 AG Grid Enterprise。行高、中文分页、Hover、Selected、固定列、跨行、
文本溢出和滚动规则统一见 `ag-grid.md`。

## Drawer

- Drawer 铺满当前应用可用区域，兼容独立运行和 Garfish 嵌入。
- Root、Wrapper 和 Content 形成完整 `height: 100%` 高度链。
- Header 和 Footer 是否存在由产品决定；存在时固定，不存在时不保留空容器和占位间距。
- Body 使用 `flex: 1`、`min-height: 0`，内容超出时由 Body 独立滚动。
- 优先使用组件属性、`styles`、`rootStyle` 或语义插槽配置；能力不足时才使用局部
  `rootClassName` 覆盖。
- Mask 颜色和透明度读取设计稿或主题 Token，不使用不透明纯黑，也不给整个 Drawer
  设置 opacity。
- Drawer 高度、滚动和 Mask 覆盖必须限定作用域。

## 视觉验收

开发完成后必须结合实际运行页面检查：

- 页面 Padding、模块间距、Panel 圆角、背景和边界所有者。
- 控件尺寸、Label、Button 文案、Tooltip 和所有相关交互状态。
- 正常宽度、窗口缩小、浏览器控制台打开和内容超出后的布局与滚动。
- Drawer 高度链、Header/Footer、Body 滚动和 Mask。
- AG Grid 行高、分页中文、Hover、Selected、固定列、跨行、分割线和横向滚动。
- 实现与设计稿仍存在的偏差。

不得只依据“功能正常”判断 UI 任务完成。
