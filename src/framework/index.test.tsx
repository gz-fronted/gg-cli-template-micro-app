import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AppThemeProvider from '@/components/AppThemeProvider';
import type { AppRouteObject } from '@/router/types';
import { useGlobalStore } from '@/store/useGlobalStore';
import Framework from '.';

const createTestRoutes = (): AppRouteObject[] => [
  { path: '/', element: <div>首页内容</div> },
  { path: '/audit-log', element: <div>审计日志内容</div> },
  { path: '*', element: <div>未找到</div> },
];

describe('Framework', () => {
  afterEach(() => {
    useGlobalStore.getState().setThemeMode('gold-dark');
    document.documentElement.removeAttribute('style');
    window.localStorage.clear();
  });

  it('根据 routes 生成菜单并使用 Router 导航', async () => {
    const routes = createTestRoutes();
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(
      <AppThemeProvider showDevelopmentThemeSwitcher={false}>
        <Framework router={router} routes={routes}>
          <RouterProvider router={router} />
        </Framework>
      </AppThemeProvider>,
    );

    expect(screen.getByRole('img', { name: '国智' })).toHaveAttribute('src');
    expect(screen.getByText('智道')).toBeInTheDocument();
    expect(screen.getByText('资管服务平台')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /home/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'home' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'profile' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /未找到/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: /audit-log/ }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/audit-log');
      expect(screen.getByText('审计日志内容')).toBeInTheDocument();
    });
  });

  it('可以收起和展开 Sidebar，并在 Header 切换主题', () => {
    const routes = createTestRoutes();
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(
      <AppThemeProvider showDevelopmentThemeSwitcher={false}>
        <Framework router={router} routes={routes}>
          <RouterProvider router={router} />
        </Framework>
      </AppThemeProvider>,
    );

    expect(screen.getByRole('complementary')).toHaveStyle({ width: '200px' });
    const brandText = screen.getByText('智道').parentElement;
    const footerLabel = screen.getByText('本地开发');
    expect(brandText).toHaveAttribute('data-collapsed', 'false');
    expect(footerLabel).toHaveAttribute('data-collapsed', 'false');

    fireEvent.click(screen.getByRole('button', { name: '切换到浅色主题' }));
    expect(useGlobalStore.getState().themeMode).toBe('gold-light');
    expect(screen.getByRole('button', { name: '切换到深色主题' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '收起侧边栏' }));
    expect(screen.getByRole('complementary')).toHaveStyle({ width: '48px' });
    expect(screen.getByRole('button', { name: '展开侧边栏' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '国智' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Framework 本地开发' })).toBeInTheDocument();
    expect(brandText).toHaveAttribute('data-collapsed', 'true');
    expect(footerLabel).toHaveAttribute('data-collapsed', 'true');

    fireEvent.click(screen.getByRole('button', { name: '展开侧边栏' }));
    expect(screen.getByRole('button', { name: '收起侧边栏' })).toBeInTheDocument();
    expect(brandText).toHaveAttribute('data-collapsed', 'false');
    expect(footerLabel).toHaveAttribute('data-collapsed', 'false');
  });

  it('可以通过全局搜索打开路由列表并导航', async () => {
    const routes = createTestRoutes();
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(
      <AppThemeProvider showDevelopmentThemeSwitcher={false}>
        <Framework router={router} routes={routes}>
          <RouterProvider router={router} />
        </Framework>
      </AppThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '打开全局搜索' }));
    expect(screen.getByRole('dialog', { name: '搜索路由' })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('搜索路由名称或路径'), {
      target: { value: 'audit' },
    });
    expect(screen.queryByRole('button', { name: /home/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /audit-log/ }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/audit-log');
    });
  });
});
