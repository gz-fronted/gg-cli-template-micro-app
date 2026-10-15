import { applyDesignTokenCssVariables, ConfigProvider } from 'gz-ui-web';
import { GzFetchFeedbackProvider } from '@gz-fronted/gz-pc/fetch';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { isAppThemeMode, shouldShowThemeSwitcher } from '@/config/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useGlobalStore } from '@/store/useGlobalStore';
import ThemeSwitcher from './ThemeSwitcher';

const TEMPLATE_SCOPE = '{{ projectName }}';
const MICRO_APP_SCOPE = TEMPLATE_SCOPE.startsWith('{{') ? 'micro-app' : TEMPLATE_SCOPE;

interface AppThemeProviderProps {
  children?: ReactNode;
  showDevelopmentThemeSwitcher?: boolean;
}

interface ThemeChangeEventDetail {
  event?: string;
  payload?: unknown;
}

const THEME_CHANGE_EVENT = 'g-theme-change';

const AppThemeProvider: React.FC<AppThemeProviderProps> = (props) => {
  const { children, showDevelopmentThemeSwitcher = true } = props;
  const { changeThemeMode, themeMode } = useAppTheme();
  const showThemeSwitcher = showDevelopmentThemeSwitcher && shouldShowThemeSwitcher();

  // 主应用切换主题时会广播该事件，子应用据此持续同步，而不只读取首次挂载参数。
  useEffect(() => {
    const handleHostThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<ThemeChangeEventDetail>).detail;
      if (detail?.event !== THEME_CHANGE_EVENT || !isAppThemeMode(detail.payload)) {
        return;
      }

      useGlobalStore.getState().setThemeMode(detail.payload);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleHostThemeChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleHostThemeChange);
    };
  }, []);

  useLayoutEffect(() => {
    return applyDesignTokenCssVariables({
      includeComponents: false,
      includeCustom: true,
      themeMode,
    });
  }, [themeMode]);

  return (
    <ConfigProvider
      button={{ autoInsertSpace: false }}
      cssVarScope={MICRO_APP_SCOPE}
      locale={zhCN}
      prefixCls={MICRO_APP_SCOPE}
      theme={{ hashed: false }}
      themeMode={themeMode}
    >
      <GzFetchFeedbackProvider>
        {children}
        {showThemeSwitcher && (
          <ThemeSwitcher themeMode={themeMode} onThemeChange={changeThemeMode} />
        )}
      </GzFetchFeedbackProvider>
    </ConfigProvider>
  );
};

export default AppThemeProvider;
