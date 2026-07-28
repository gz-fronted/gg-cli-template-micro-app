# 技术栈选型

## 基础技术栈

- 前端框架：React / v19
- 前端语言：TypeScript / v5
- 路由：React Router（hash 或 history） / v7
- 状态管理：Zustand / v5
- 网络请求：Axios / v1
- 样式：Less / v4
- 构建工具：Vite / v8
- 微前端：Garfish

## 组件库

业务开发默认使用：

```text
@chenhui996/gg-ui
```

gg-ui 基于 Ant Design 6 二次封装，并支持 tokens 色系客制化配置。

当 gg-ui 暂未提供所需组件时，允许使用 Ant Design 6。

业务开发不得因为熟悉 Ant Design 而绕过 gg-ui。

## 表格组件

默认使用：

```text
ag-grid-react
```

必须使用 AG Grid Enterprise。

AG Grid 是项目默认业务表格组件，适用于常规列表、大数据量表格、虚拟滚动等场景。

除非需求明确不适用或已有项目实现要求保留，否则不得使用其他表格组件替代 AG Grid。

## 图表库

- 常规图表：ECharts，用于折线图、饼图、柱状图等。
- K 线图：KLineChart，用于股票行情等大数据量 K 线图。
