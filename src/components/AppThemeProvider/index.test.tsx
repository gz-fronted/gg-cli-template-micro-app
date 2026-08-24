import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useGlobalStore } from '@/store/useGlobalStore';
import AppThemeProvider from '.';

describe('AppThemeProvider', () => {
  afterEach(() => {
    useGlobalStore.getState().setThemeMode('gold-dark');
    document.documentElement.removeAttribute('style');
    window.history.replaceState({}, '', '/');
    window.localStorage.clear();
  });

  it('链接参数启用时展示本地主题切换器', () => {
    window.history.replaceState({}, '', '/?themeSwitcher=1');

    render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );

    expect(screen.getByLabelText('切换主题')).toBeInTheDocument();
  });

  it('卸载时恢复主应用原有的 CSS 变量', () => {
    document.documentElement.style.setProperty('--gz-color-bg-layout', 'host-value');

    const { unmount } = render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );

    expect(document.documentElement.style.getPropertyValue('--gz-color-bg-layout')).toBe('#141414');

    unmount();

    expect(document.documentElement.style.getPropertyValue('--gz-color-bg-layout')).toBe(
      'host-value',
    );
  });

  it('主应用广播有效主题时同步 Store 和 CSS 变量', () => {
    const { unmount } = render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent('g-theme-change', {
          detail: { event: 'g-theme-change', payload: 'blue-light' },
        }),
      );
    });

    expect(useGlobalStore.getState().themeMode).toBe('blue-light');
    expect(document.documentElement.style.getPropertyValue('--gz-color-bg-layout')).toBe('#F5F5F5');

    unmount();
  });

  it('卸载后停止接收主应用主题广播', () => {
    const { unmount } = render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );
    unmount();

    act(() => {
      window.dispatchEvent(
        new CustomEvent('g-theme-change', {
          detail: { event: 'g-theme-change', payload: 'gold-light' },
        }),
      );
    });

    expect(useGlobalStore.getState().themeMode).toBe('gold-dark');
  });

  it('忽略无效的主题广播', () => {
    render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent('g-theme-change', {
          detail: { event: 'g-theme-change', payload: 'unknown-theme' },
        }),
      );
    });

    expect(useGlobalStore.getState().themeMode).toBe('gold-dark');
  });
});
