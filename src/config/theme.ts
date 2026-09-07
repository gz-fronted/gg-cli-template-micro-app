import type { GZThemeMode } from '@chenhui996/gg-ui';

export type AppThemeMode = Extract<GZThemeMode, 'gold-dark' | 'gold-light'>;

export const DEFAULT_THEME_MODE: AppThemeMode = 'gold-dark';
export const THEME_STORAGE_KEY = '{{ projectName }}.theme-mode';
export const THEME_SWITCHER_STORAGE_KEY = 'showThemeSwitcher';
export const THEME_SWITCHER_QUERY_KEY = 'themeSwitcher';

export const THEME_MODE_OPTIONS: ReadonlyArray<{
  label: string;
  value: AppThemeMode;
}> = [
  { label: '金色 / 深色', value: 'gold-dark' },
  { label: '金色 / 浅色', value: 'gold-light' },
];

const THEME_MODES = new Set<AppThemeMode>(THEME_MODE_OPTIONS.map((option) => option.value));

export const isAppThemeMode = (value: unknown): value is AppThemeMode =>
  typeof value === 'string' && THEME_MODES.has(value as AppThemeMode);

export const resolveThemeMode = (...candidates: readonly unknown[]): AppThemeMode =>
  candidates.find(isAppThemeMode) ?? DEFAULT_THEME_MODE;

export const readStoredThemeMode = (): AppThemeMode => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME_MODE;
  }

  return resolveThemeMode(window.localStorage.getItem(THEME_STORAGE_KEY));
};

export const persistThemeMode = (themeMode: AppThemeMode): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }
};

export const shouldShowThemeSwitcher = (): boolean => {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return false;
  }

  const queryEnabled =
    new URLSearchParams(window.location.search).get(THEME_SWITCHER_QUERY_KEY) === '1';
  const storageEnabled = window.localStorage.getItem(THEME_SWITCHER_STORAGE_KEY) === '1';

  return queryEnabled || storageEnabled;
};
