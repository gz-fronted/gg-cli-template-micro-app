import { persistThemeMode, type AppThemeMode } from '@/config/theme';
import { useGlobalStore } from '@/store/useGlobalStore';

interface AppThemeState {
  changeThemeMode: (themeMode: AppThemeMode) => void;
  themeMode: AppThemeMode;
}

export const useAppTheme = (): AppThemeState => {
  const themeMode = useGlobalStore((state) => state.themeMode);
  const setThemeMode = useGlobalStore((state) => state.setThemeMode);

  const changeThemeMode = (nextThemeMode: AppThemeMode): void => {
    setThemeMode(nextThemeMode);
    persistThemeMode(nextThemeMode);
  };

  return { changeThemeMode, themeMode };
};
