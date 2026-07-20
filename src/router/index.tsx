/**
 * 路由配置 (React Router Data API)
 * 采用对象配置模式，便于管理和扩展
 */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { Spin } from 'antd';
import BasicLayout from '@/layouts/BasicLayout';

// 路由懒加载配置
const Home = lazy(() => import('@/pages/home'));
const NotFound = lazy(() => import('@/pages/404'));

// 全局 Loading 组件
const Loading = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: 400,
    }}
  >
    <Spin size="large" />
  </div>
);

// 包装懒加载组件，统一添加 Suspense
function withSuspense(Component: LazyExoticComponent<ComponentType<any>>) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}

const routes = [
  {
    path: '/',
    // 根布局：BasicLayout
    element: <BasicLayout />,
    // 子路由：渲染在 BasicLayout 的 <Outlet /> 中
    children: [
      {
        index: true, // 默认子路由 (首页)
        element: withSuspense(Home),
      },
      // 404 页面配置
      {
        path: '*',
        element: withSuspense(NotFound),
      },
    ],
  },
];

export { routes };
