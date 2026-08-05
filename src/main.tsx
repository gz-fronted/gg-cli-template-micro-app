import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { reactBridge, type PropsInfo } from '@garfish/bridge-react-v18';
import { ConfigProvider } from 'gz-ui';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { configureRequest } from '@/bootstrap/configure-request';
import { enableMock } from '@/bootstrap/enable-mock';
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

// 初始化项目时由 gg-cli 替换，避免多个微应用的组件样式互相覆盖。
const MICRO_PREFIX_CLS = '{{ projectName }}';

interface ApplicationRootProps {
  basename: string;
}

interface GarfishCustomProps {
  globalState?: Partial<Pick<GlobalState, 'user' | 'token' | 'themeMode'>>;
}

// 独立运行和 Garfish 挂载共用同一个应用根组件。
const ApplicationRoot: React.FC<ApplicationRootProps> = (props) => {
  const { basename } = props;
  const router = createBrowserRouter(routes, { basename });

  return (
    <ConfigProvider
      button={{ autoInsertSpace: false }}
      locale={zhCN}
      prefixCls={MICRO_PREFIX_CLS}
      theme={{ cssVar: { key: MICRO_PREFIX_CLS }, hashed: false }}
      themeMode="gold-dark"
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

// 微前端入口：首次渲染前接收主应用状态，并按当前环境启动 Mock。
export const provider = reactBridge({
  el: '#root',
  loadRootComponent: async (appInfo: PropsInfo) => {
    const { globalState } = appInfo.props as GarfishCustomProps;
    if (globalState) {
      useGlobalStore.getState().setGlobalState(globalState);
    }

    await enableMock();
    return ApplicationRoot;
  },
  errorBoundary: () => <div>子应用加载异常，请稍后重试</div>,
});

// 独立运行入口：从本地缓存初始化 Token，不依赖 Garfish 主应用。
const bootstrapStandalone = async (): Promise<void> => {
  useGlobalStore.getState().setGlobalState({
    themeMode: 'dark',
    token: window.localStorage.getItem('token'),
  });
  await enableMock();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('应用根节点不存在');
  }

  createRoot(rootElement).render(<ApplicationRoot basename="/" />);
};

if (!window.__GARFISH__) {
  bootstrapStandalone();
}
