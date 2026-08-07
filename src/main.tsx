import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { reactBridge, type PropsInfo } from '@garfish/bridge-react-v18';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { configureRequest } from '@/bootstrap/configure-request';
import { enableMock } from '@/bootstrap/enable-mock';
import AppThemeProvider from '@/components/AppThemeProvider';
import { readStoredThemeMode, resolveThemeMode } from '@/config/theme';
import { routes } from '@/router';
import { useGlobalStore, type GlobalState } from '@/store/useGlobalStore';
import './style.less';

// Ant Design 组件文案和 Day.js 日期文案统一使用简体中文。
dayjs.locale('zh-cn');

// 在页面发起请求前完成 gzFetch 的 Token、错误处理等基础配置。
configureRequest();

// Garfish 主应用通常已经加载 reset.css，独立运行时由子应用自行补充。
if (!window.__GARFISH__) {
  import('antd/dist/reset.css');
}

// 主题 Provider 内的 cssVarScope 会由 gg-cli 使用项目名替换，隔离多个微应用的组件变量。
interface ApplicationRootProps {
  applyCssVariables?: boolean;
  basename: string;
  showLocalSwitcher?: boolean;
}

interface GarfishCustomProps {
  globalState?: Partial<Pick<GlobalState, 'user' | 'token'>> & {
    themeMode?: unknown;
  };
  themeMode?: unknown;
}

// 独立运行和 Garfish 挂载共用同一个应用根组件。
const ApplicationRoot: React.FC<ApplicationRootProps> = (props) => {
  const { applyCssVariables = false, basename, showLocalSwitcher = false } = props;
  const router = createBrowserRouter(routes, { basename });

  return (
    <AppThemeProvider applyCssVariables={applyCssVariables} showLocalSwitcher={showLocalSwitcher}>
      <RouterProvider router={router} />
    </AppThemeProvider>
  );
};

// 微前端入口：首次渲染前接收主应用状态，并按当前环境启动 Mock。
export const provider = reactBridge({
  el: '#root',
  loadRootComponent: async (appInfo: PropsInfo) => {
    const { globalState, themeMode } = appInfo.props as GarfishCustomProps;
    if (globalState) {
      const { themeMode: globalThemeMode, ...sharedState } = globalState;
      useGlobalStore.getState().setGlobalState(sharedState);
      useGlobalStore.getState().setThemeMode(resolveThemeMode(themeMode ?? globalThemeMode));
    } else {
      useGlobalStore.getState().setThemeMode(resolveThemeMode(themeMode));
    }

    await enableMock();
    return ApplicationRoot;
  },
  errorBoundary: () => <div>子应用加载异常，请稍后重试</div>,
});

// 独立运行入口：从本地缓存初始化 Token，不依赖 Garfish 主应用。
const bootstrapStandalone = async (): Promise<void> => {
  useGlobalStore.getState().setGlobalState({
    token: window.localStorage.getItem('token'),
  });
  useGlobalStore.getState().setThemeMode(readStoredThemeMode());
  await enableMock();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('应用根节点不存在');
  }

  createRoot(rootElement).render(
    <ApplicationRoot
      applyCssVariables
      basename="/"
      showLocalSwitcher={import.meta.env.DEV && Boolean(localStorage.getItem('showThemeSwitcher'))}
    />,
  );
};

if (!window.__GARFISH__) {
  bootstrapStandalone();
}
