import { describe, expect, it } from 'vitest';
import { isSharedDependency, microAppRuntime, normalizeModuleId } from './micro-app-runtime';

describe('共享依赖边界', () => {
  it.each([
    '/repo/src/main.tsx',
    'C:/repo/src/main.tsx',
    'C:\\repo\\src\\main.tsx',
    '\\\\server\\repo\\src\\main.tsx',
    './react',
    '@/react',
    '#react',
    '\0react',
    '@gz-fronted/gz-pc/fetch',
    '@gz-fronted/gz-pc/hooks',
    '@garfish/bridge-react-v18',
    'zustand',
    'msw/browser',
    'antd/dist/reset.css?inline',
  ])('源码与会话模块留在页面：%s', (id) => {
    expect(isSharedDependency(id)).toBe(false);
  });
  it.each([
    'react',
    'react/jsx-runtime',
    'react/compiler-runtime',
    'react-dom/client',
    'gz-ui-web',
    'antd/locale/zh_CN',
    'dayjs/locale/zh-cn',
    'axios',
  ])('共享稳定库：%s', (id) => {
    expect(isSharedDependency(id)).toBe(true);
  });
  it('Windows 路径和 Vite 查询串可以匹配真实入口', () => {
    expect(normalizeModuleId('C:\\repo\\src\\main.tsx?v=1')).toBe('C:/repo/src/main.tsx');
  });
  it('入口未转换时直接让构建失败', async () => {
    const hook = microAppRuntime().generateBundle;
    const handler = typeof hook === 'function' ? hook : hook?.handler;
    expect(handler).toBeDefined();
    await expect(
      Reflect.apply(
        handler!,
        {
          error: (message: string) => {
            throw new Error(message);
          },
        },
        [{}, {}],
      ),
    ).rejects.toThrow('业务入口未经过转换');
  });
});
