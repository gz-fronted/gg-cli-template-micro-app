import type { GZThemeMode } from '@chenhui996/gg-ui';

export const DEFAULT_THEME_MODE: GZThemeMode = 'gold-dark';
export const THEME_STORAGE_KEY = '{{ projectName }}.theme-mode';
export const THEME_SWITCHER_STORAGE_KEY = 'showThemeSwitcher';
export const THEME_SWITCHER_QUERY_KEY = 'themeSwitcher';

export const THEME_MODE_OPTIONS: ReadonlyArray<{
  label: string;
  value: GZThemeMode;
}> = [
  { label: '金色 / 深色', value: 'gold-dark' },
  { label: '金色 / 浅色', value: 'gold-light' },
  { label: '蓝色 / 深色', value: 'blue-dark' },
  { label: '蓝色 / 浅色', value: 'blue-light' },
];

const THEME_MODES = new Set<GZThemeMode>(THEME_MODE_OPTIONS.map((option) => option.value));

export const isGzThemeMode = (value: unknown): value is GZThemeMode =>
  typeof value === 'string' && THEME_MODES.has(value as GZThemeMode);

export const resolveThemeMode = (...candidates: readonly unknown[]): GZThemeMode =>
  candidates.find(isGzThemeMode) ?? DEFAULT_THEME_MODE;

export const readStoredThemeMode = (): GZThemeMode => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME_MODE;
  }

  return resolveThemeMode(window.localStorage.getItem(THEME_STORAGE_KEY));
};

export const persistThemeMode = (themeMode: GZThemeMode): void => {
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
