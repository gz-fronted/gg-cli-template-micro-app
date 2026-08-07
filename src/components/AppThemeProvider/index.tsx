import { applyDesignTokenCssVariables, ConfigProvider } from 'gz-ui';
import zhCN from 'antd/locale/zh_CN';
import { lazy, Suspense, useLayoutEffect, type PropsWithChildren } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';

const LocalThemeSwitcher = lazy(() => import('./LocalThemeSwitcher'));

interface AppThemeProviderProps extends PropsWithChildren {
  applyCssVariables?: boolean;
  showLocalSwitcher?: boolean;
}

const AppThemeProvider: React.FC<AppThemeProviderProps> = (props) => {
  const { applyCssVariables = false, children, showLocalSwitcher = false } = props;
  const themeMode = useGlobalStore((state) => state.themeMode);

  useLayoutEffect(() => {
    if (!applyCssVariables) {
      return undefined;
    }

    return applyDesignTokenCssVariables({ themeMode });
  }, [applyCssVariables, themeMode]);

  return (
    <ConfigProvider
      button={{ autoInsertSpace: false }}
      cssVarScope="{{ projectName }}"
      locale={zhCN}
      prefixCls="{{ projectName }}"
      theme={{ hashed: false }}
      themeMode={themeMode}
    >
      {children}
      {showLocalSwitcher && (
        <Suspense fallback={null}>
          <LocalThemeSwitcher />
        </Suspense>
      )}
    </ConfigProvider>
  );
};

export default AppThemeProvider;
