import { afterEach, describe, expect, it } from 'vitest';
import { resolveThemeMode, shouldShowThemeSwitcher, THEME_SWITCHER_STORAGE_KEY } from './theme';

afterEach(() => {
  window.history.replaceState({}, '', '/');
  window.localStorage.clear();
});

describe('resolveThemeMode', () => {
  it('返回候选值中第一个有效主题', () => {
    expect(resolveThemeMode('blue-light', 'gold-light')).toBe('gold-light');
  });

  it('没有有效候选值时返回默认主题', () => {
    expect(resolveThemeMode(undefined, null, 'unknown-theme')).toBe('gold-dark');
  });
});

describe('shouldShowThemeSwitcher', () => {
  it('链接参数 themeSwitcher=1 时显示切换器', () => {
    window.history.replaceState({}, '', '/?themeSwitcher=1');

    expect(shouldShowThemeSwitcher()).toBe(true);
  });

  it('localStorage 配置为 1 时显示切换器', () => {
    window.localStorage.setItem(THEME_SWITCHER_STORAGE_KEY, '1');

    expect(shouldShowThemeSwitcher()).toBe(true);
  });

  it('未配置开关时隐藏切换器', () => {
    expect(shouldShowThemeSwitcher()).toBe(false);
  });
});
