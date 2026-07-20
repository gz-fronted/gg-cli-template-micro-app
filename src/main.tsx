import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { reactBridge } from '@garfish/bridge-react-v18';
import { ConfigProvider } from 'gz-ui';
import { routes } from '@/router';
import { useGlobalStore } from '@/store/useGlobalStore';
import './style.less';

// 微前端环境下，由于主应用已经引入了 reset.css 或类似的全局重置样式，
// 子应用再引入会导致切换时样式的重复挂载和卸载，从而引发全局界面的重绘闪烁。
if (!window.__GARFISH__) {
  import('antd/dist/reset.css');
}

// 定义子应用专属的样式前缀
const MICRO_PREFIX_CLS = 'micro1';

export const provider = reactBridge({
  el: '#root',
  // Garfish 会将主应用传递的 appInfo 作为参数传入
  rootComponent: (appInfo: any) => {
    console.log('appInfo', appInfo);

    // 拦截主应用传来的数据，并同步到子应用的全局状态中
    if (appInfo?.props?.globalState) {
      // 避免 React render 阶段直接触发 zustand 更新警告，我们利用微任务或者只在初始化时设置
      useGlobalStore.getState().setGlobalState(appInfo.props.globalState);
    }

    // 注册 router
    const router = createBrowserRouter(routes, {
      basename: appInfo?.props.globalState.basename,
    });
    // 使用 ConfigProvider 包裹路由，并设置专属的 CSS 前缀和独立的 cssVar
    return (
      <ConfigProvider
        prefixCls={MICRO_PREFIX_CLS}
        theme={{ cssVar: { key: 'micro-app' }, hashed: false }}
        themeMode="gold-dark"
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    );
  },
  errorBoundary: () => <div>子应用加载异常，请稍后重试</div>,
});

// src/main.js
if (!window.__GARFISH__) {
  // 注册 router
  const router = createBrowserRouter(routes, {
    basename: '/',
  });

  // 同步主题模式到全局 store
  useGlobalStore.getState().setGlobalState({ themeMode: 'dark' });

  createRoot(document.getElementById('root')!).render(
    <ConfigProvider
      prefixCls={MICRO_PREFIX_CLS}
      theme={{ cssVar: { key: 'micro-app' }, hashed: false }}
      themeMode="gold-dark"
    >
      <RouterProvider router={router} />
    </ConfigProvider>,
  );
}
