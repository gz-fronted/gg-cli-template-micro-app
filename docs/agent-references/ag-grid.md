# AG Grid 开发规范

## 默认规则

- 常规业务列表、大数据量表格和虚拟滚动场景默认使用 AG Grid Enterprise。
- 除非需求明确不适用或已有实现必须保留，不得替换为其他组件库的 Table。
- AG Grid License 的注册值和注册位置由项目基础设施维护；普通业务任务只核对，不修改。
- 所有列定义、回调参数和行数据必须提供准确 TypeScript 类型。

## 公共配置

优先复用 `src/config/ag-grid.ts` 的 `DEFAULT_AG_GRID_OPTIONS`：

```text
headerHeight: 32
rowHeight: 28
localeText: AG_GRID_LOCALE_CN
suppressCellFocus: true
```

业务模块只覆盖产品或设计稿明确要求的项。通用配置放在 `src/config/`，业务列定义保留在
对应页面附近，不在 JSX 中堆积复杂配置。

分页区域所有可见文案必须中文化，不得只修改“暂无数据”。新增 localeText Key 前确认
当前 AG Grid 版本支持该字段。

## 行状态和对齐

模板标准行状态使用基础色 `#FFE7CB`：

- Hover：`rgba(255, 231, 203, 0.15)`。
- Selected：`rgba(255, 231, 203, 0.12)`。
- Hover + Selected：`rgba(255, 231, 203, 0.26)`。

固定列与中心区域同一行的背景必须一致。状态圆点、Tag、按钮和文本在当前行高中垂直
居中，点击区域不得溢出数据行。

操作列表头和内容默认左对齐，内容左侧间距 `8px`；只能通过明确的 headerClass 和
cellClass 影响操作列，不修改其他列。

## 固定列和分割线

- 使用 `pinned`，不得用 `position: sticky` 模拟；需要禁止取消固定时配置 `lockPinned`。
- 固定列背景与普通区域一致，滚动时不得透明、重叠、闪烁。
- pinned 容器边界不得叠加整高 Border、Shadow、resize handle 和自定义分割线。
- 表头短分割线的方向、位置和尺寸以设计稿或项目 Token 为准。
- 使用明确 `headerClass` 排除首列或末列，不依赖 pinned DOM 中不稳定的
  `:first-child`、`:last-child`。
- 编写第三方选择器前检查实际 DOM 和 AG Grid 版本，不假设旧版本类名仍存在。

## 跨行合并

- 优先使用当前版本的原生 Cell Spanning 能力。AG Grid 36 使用
  `enableCellSpan` 和 `spanRows`。
- 跨行判断必须比较相邻行的真实分组键，不能只比较展示值。
- 每行保留完整源数据，不使用隐藏影子单元格、清空重复值或 DOM 状态模拟合并。
- 合并单元格必须验证居中、边框和虚拟滚动往返后的展示状态。

## 列宽、溢出和 Tooltip

- 名称、路径、说明、业务对象、长编码和备注设置合理 `minWidth`。
- 长文本默认单行省略，不为消除横向滚动而无限压缩列宽。
- Tooltip 只在文本实际溢出时展示，内容等于完整原始值。
- 列总宽度超过容器时保留横向滚动能力。

## 验收清单

- 表头和数据行高度、文本、图标、Tag 和按钮垂直对齐。
- 分页区域无未处理英文文案。
- Hover、Selected 及组合状态在中心区和固定列保持一致。
- 横向滚动时固定列无透明、重叠、双线、闪烁或阴影叠加。
- 纵向滚动到底并返回后，跨行内容仍存在且分组边界一致。
- 调整窗口尺寸或打开控制台后，表格仍受容器约束且滚动归属正确。
