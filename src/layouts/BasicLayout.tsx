import { Outlet } from 'react-router-dom';

/**
 * 子应用基础布局组件 (BasicLayout)
 *
 * 作为微前端的业务模块，子应用不需要包含侧边栏 (Sider) 和顶栏 (Header)。
 * 它只需要作为一个纯粹的视图容器，将自身的路由内容渲染到主应用的 Content 区域中。
 */
export default function BasicLayout() {
  return (
    <div
      className="{{ projectName }}-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: 'var(--gz-color-bg-layout)',
        borderRadius: 8,
      }}
    >
      {/* 
        此处可以放置子应用全局共享的逻辑，例如：
        - 子应用级别的 ErrorBoundary
        - 子应用级别的权限校验
        - 子应用特有的水印等
      */}
      <Outlet />
    </div>
  );
}
