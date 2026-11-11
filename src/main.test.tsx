import { act } from '@testing-library/react';
import { afterAll, describe, expect, it, vi } from 'vitest';
import type { PropsInfo } from '@garfish/bridge-react-v18';
import { useGlobalStore } from '@/store/useGlobalStore';

vi.mock('@/components/AppThemeProvider', () => ({
  default: (props: { children: React.ReactNode }) => props.children,
}));
vi.mock('@/router', () => ({ routes: [{ path: '*', element: <div>测试页面</div> }] }));
vi.mock('@/bootstrap/enable-mock', () => ({
  enableMock: vi.fn().mockResolvedValue(undefined),
  disableMock: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@gz-fronted/gz-pc/fetch', async (original) => ({
  ...(await original<typeof import('@gz-fronted/gz-pc/fetch')>()),
  configureGzFetch: vi.fn(),
}));

window.__GARFISH__ = true;
const { provider } = await import('./main');
afterAll(() => {
  delete window.__GARFISH__;
});

describe('真实 bridge 的挂载和销毁', () => {
  it('释放 React root、Router 监听和会话，并允许再次挂载', async () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const dom = document.createElement('section');
    dom.innerHTML = '<div id="root"></div>';
    document.body.append(dom);
    const info: PropsInfo = { appName: 'test', basename: '/', dom, props: {}, appRenderInfo: {} };
    const first = await provider(info, {
      globalState: { token: 'virtual-first', user: { name: 'first', dept: '', role: '' } },
    });
    const listeners = add.mock.calls.filter(([name]) => name === 'popstate');
    expect(listeners).toHaveLength(1);
    await act(async () => first.render(info));
    expect(dom.textContent).toContain('测试页面');
    await act(async () => first.destroy(info));
    await first.destroy(info);
    expect(dom.textContent).toBe('');
    expect(
      remove.mock.calls.some(
        ([name, handler]) => name === 'popstate' && handler === listeners[0][1],
      ),
    ).toBe(true);
    expect(useGlobalStore.getState().token).toBeNull();
    expect(useGlobalStore.getState().user).toBeNull();
    const second = await provider(info);
    expect(useGlobalStore.getState().token).toBeNull();
    await act(async () => second.render(info));
    await act(async () => second.destroy(info));
    dom.remove();
    add.mockRestore();
    remove.mockRestore();
  });
});
