import { applyDesignTokenCssVariables, ConfigProvider, Select, type GZThemeMode } from 'gz-ui';
import zhCN from 'antd/locale/zh_CN';
import { useLayoutEffect, type PropsWithChildren } from 'react';
import { persistThemeMode, THEME_MODE_OPTIONS } from '@/config/theme';
import { useGlobalStore } from '@/store/useGlobalStore';
import styles from './index.module.less';

const TEMPLATE_SCOPE = '{{ projectName }}';
const MICRO_APP_SCOPE = TEMPLATE_SCOPE.startsWith('{{') ? 'micro-app' : TEMPLATE_SCOPE;

interface AppThemeProviderProps extends PropsWithChildren {
  applyCssVariables?: boolean;
  showLocalSwitcher?: boolean;
}

const AppThemeProvider: React.FC<AppThemeProviderProps> = (props) => {
  const { applyCssVariables = false, children, showLocalSwitcher = false } = props;
  const themeMode = useGlobalStore((state) => state.themeMode);
  const setThemeMode = useGlobalStore((state) => state.setThemeMode);

  useLayoutEffect(() => {
    if (!applyCssVariables) {
      return undefined;
    }

    return applyDesignTokenCssVariables({ themeMode });
  }, [applyCssVariables, themeMode]);

  const handleThemeChange = (nextThemeMode: GZThemeMode) => {
    setThemeMode(nextThemeMode);
    persistThemeMode(nextThemeMode);
  };

  return (
    <ConfigProvider
      button={{ autoInsertSpace: false }}
      cssVarScope={MICRO_APP_SCOPE}
      locale={zhCN}
      prefixCls={MICRO_APP_SCOPE}
      theme={{ hashed: false }}
      themeMode={themeMode}
    >
      {children}
      {showLocalSwitcher && (
        <div className={styles.themeSwitcher}>
          <span>主题</span>
          <Select
            aria-label="切换主题"
            className={styles.themeSelect}
            options={[...THEME_MODE_OPTIONS]}
            value={themeMode}
            onChange={handleThemeChange}
          />
        </div>
      )}
    </ConfigProvider>
  );
};

export default AppThemeProvider;
