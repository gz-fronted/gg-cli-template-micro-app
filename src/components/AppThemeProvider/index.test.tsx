import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGlobalStore } from '@/store/useGlobalStore';
import AppThemeProvider from '.';

describe('AppThemeProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
    expect(screen.getByRole('button', { name: '拖动主题切换器' })).toBeInTheDocument();
  });

  it('允许拖动主题切换器并限制在可视区域内', () => {
    window.history.replaceState({}, '', '/?themeSwitcher=1');

    render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );

    const themeSwitcher = screen.getByRole('group', { name: '主题切换器' });
    const dragHandle = screen.getByRole('button', { name: '拖动主题切换器' });
    vi.spyOn(themeSwitcher, 'getBoundingClientRect').mockReturnValue({
      bottom: 60,
      height: 48,
      left: 800,
      right: 1000,
      top: 12,
      width: 200,
      x: 800,
      y: 12,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(dragHandle, { button: 0, clientX: 810, clientY: 20, pointerId: 1 });
    fireEvent.pointerMove(dragHandle, { clientX: 2000, clientY: 2000, pointerId: 1 });
    fireEvent.pointerUp(dragHandle, { pointerId: 1 });

    expect(themeSwitcher).toHaveStyle({
      left: `${window.innerWidth - 200}px`,
      top: `${window.innerHeight - 48}px`,
    });
    expect(themeSwitcher).toHaveAttribute('data-dragging', 'false');
  });

  it('允许通过方向键调整主题切换器位置', () => {
    window.history.replaceState({}, '', '/?themeSwitcher=1');

    render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );

    const themeSwitcher = screen.getByRole('group', { name: '主题切换器' });
    const dragHandle = screen.getByRole('button', { name: '拖动主题切换器' });
    vi.spyOn(themeSwitcher, 'getBoundingClientRect').mockReturnValue({
      bottom: 60,
      height: 48,
      left: 800,
      right: 1000,
      top: 12,
      width: 200,
      x: 800,
      y: 12,
      toJSON: () => ({}),
    });

    fireEvent.keyDown(dragHandle, { key: 'ArrowLeft' });

    expect(themeSwitcher).toHaveStyle({ left: '790px', top: '12px' });
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

  it('主应用广播有效主题时同步 Store 和 CSS 变量', async () => {
    const { unmount } = render(
      <AppThemeProvider>
        <div>content</div>
      </AppThemeProvider>,
    );

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent('g-theme-change', {
          detail: { event: 'g-theme-change', payload: 'gold-light' },
        }),
      );
      await Promise.resolve();
    });

    expect(useGlobalStore.getState().themeMode).toBe('gold-light');
    expect(document.documentElement.style.getPropertyValue('--gz-color-bg-layout')).toBe('#F4FBFF');

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
          detail: { event: 'g-theme-change', payload: 'blue-light' },
        }),
      );
    });

    expect(useGlobalStore.getState().themeMode).toBe('gold-dark');
  });
});
