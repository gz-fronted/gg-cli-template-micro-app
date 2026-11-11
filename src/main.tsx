import { createRoot, type Root } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { reactBridge, type PropsInfo } from '@garfish/bridge-react-v18';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { ComponentType, ReactNode } from 'react';
import { configureRequest } from '@/bootstrap/configure-request';
import { disableMock, enableMock } from '@/bootstrap/enable-mock';
import AppThemeProvider from '@/components/AppThemeProvider';
import { shouldUseFramework } from '@/config/framework';
import { readStoredThemeMode, resolveThemeMode } from '@/config/theme';
import { routes } from '@/router';
import type { AppRouteObject } from '@/router/types';
import { resetGlobalState, useGlobalStore, type GlobalState } from '@/store/useGlobalStore';
import './style.less';

dayjs.locale('zh-cn');

type AppRouter = ReturnType<typeof createBrowserRouter>;

interface ApplicationRootProps {
  router: AppRouter;
  Framework?: ComponentType<FrameworkProps>;
}

interface FrameworkProps {
  children?: ReactNode;
  router: AppRouter;
  routes: readonly AppRouteObject[];
}

interface GarfishCustomProps {
  globalState?: Partial<Pick<GlobalState, 'user' | 'token'>> & {
    themeMode?: unknown;
    basename?: string;
  };
  themeMode?: unknown;
}

const ApplicationRoot: React.FC<ApplicationRootProps> = (props) => {
  const { router, Framework } = props;
  const routerContent = <RouterProvider router={router} />;

  return (
    <AppThemeProvider showDevelopmentThemeSwitcher={!Framework}>
      {Framework ? (
        <Framework router={router} routes={routes}>
          {routerContent}
        </Framework>
      ) : (
        routerContent
      )}
    </AppThemeProvider>
  );
};

// Router 在 React render 之外创建，保证重渲染不增加 history 监听。
const createSession = (basename: string) => {
  const cancelRequests = configureRequest();
  const router = createBrowserRouter(routes, { basename });
  let disposed = false;
  return {
    router,
    dispose: async () => {
      if (disposed) return;
      disposed = true;
      cancelRequests();
      router.dispose();
      resetGlobalState();
      await disableMock();
    },
  };
};

// opts 中的三个容器不能复用 bridge 的模块级默认对象。
// 页面包每次执行拥有独立 Store、请求配置和 bridge；共享运行时不包含这些模块。
export const provider = async (appInfo: PropsInfo, customProps: GarfishCustomProps = {}) => {
  resetGlobalState();
  const { globalState, themeMode } = customProps;
  useGlobalStore.getState().setGlobalState({
    user: globalState?.user ?? null,
    token: globalState?.token ?? null,
  });
  useGlobalStore.getState().setThemeMode(resolveThemeMode(themeMode, globalState?.themeMode));

  let session: ReturnType<typeof createSession> | undefined = createSession(
    globalState?.basename ?? appInfo.basename ?? '/',
  );
  let bridgeLifecycle: Awaited<ReturnType<ReturnType<typeof reactBridge>>> | undefined;
  try {
    await enableMock();
    const bridge = reactBridge({
      el: '#root',
      domElements: {},
      renderResults: {},
      updateResolves: {},
      rootComponent: () => (session ? <ApplicationRoot router={session.router} /> : null),
      errorBoundary: () => <div>子应用加载异常，请稍后重试</div>,
    });
    // bridge 会自动注册自身；恢复对外的、包含清理逻辑的 provider。
    registerProvider();
    bridgeLifecycle = await bridge(appInfo, customProps);
  } catch (error) {
    await session.dispose();
    session = undefined;
    throw error;
  }

  let rendered = false;
  return {
    render: (info: PropsInfo) => {
      if (!session || rendered) return;
      // 会话已在挂载前写入 Store。不要把用户、Token 和 hostLoad 闭包再放进 Fiber props。
      bridgeLifecycle?.render({ ...info, props: {} });
      rendered = true;
    },
    destroy: async (info: PropsInfo) => {
      if (!session) return;
      try {
        if (rendered) bridgeLifecycle?.destroy(info);
      } finally {
        bridgeLifecycle = undefined;
        rendered = false;
        const closing = session;
        session = undefined;
        await closing.dispose();
      }
    },
  };
};

// 经典页面脚本和 Vite 开发模式均使用 Garfish 的正式注册通道。
function registerProvider(): void {
  if (window.__GARFISH__ && typeof __GARFISH_EXPORTS__ === 'object') {
    if (__GARFISH_EXPORTS__.registerProvider) {
      __GARFISH_EXPORTS__.registerProvider(provider);
    } else {
      __GARFISH_EXPORTS__.provider = provider;
    }
  }
}
registerProvider();

const bootstrapStandalone = async (): Promise<void> => {
  useGlobalStore.getState().setGlobalState({ token: window.localStorage.getItem('token') });
  useGlobalStore.getState().setThemeMode(readStoredThemeMode());
  const session = createSession('/');
  let root: Root | undefined;
  let resetStyle: HTMLStyleElement | undefined;
  try {
    const { default: resetCss } = await import('antd/dist/reset.css?inline');
    resetStyle = document.createElement('style');
    resetStyle.textContent = resetCss;
    document.head.append(resetStyle);
    await enableMock();
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('应用根节点不存在');
    const Framework =
      import.meta.env.DEV && shouldUseFramework(true, import.meta.env.VITE_FRAMEWORK)
        ? (await import('@/framework')).default
        : undefined;
    root = createRoot(rootElement);
    root.render(<ApplicationRoot router={session.router} Framework={Framework} />);
    import.meta.hot?.dispose(() => {
      root?.unmount();
      resetStyle?.remove();
      void session.dispose();
    });
  } catch (error) {
    root?.unmount();
    resetStyle?.remove();
    await session.dispose();
    throw error;
  }
};

if (!window.__GARFISH__) {
  void bootstrapStandalone();
}
