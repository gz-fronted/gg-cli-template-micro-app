import type { GZThemeMode } from 'gz-ui';

export const DEFAULT_THEME_MODE: GZThemeMode = 'gold-dark';
export const THEME_STORAGE_KEY = '{{ projectName }}.theme-mode';

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

export const resolveThemeMode = (value: unknown): GZThemeMode =>
  isGzThemeMode(value) ? value : DEFAULT_THEME_MODE;

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
