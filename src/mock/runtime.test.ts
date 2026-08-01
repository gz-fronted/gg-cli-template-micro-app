import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { createMockHandlers, defineMock, resetMockStore } from './runtime';

interface Item {
  id: number;
  name: string;
}

const initialItems: Item[] = [{ id: 1, name: '默认数据' }];

const modules = [
  defineMock({
    '/example/ping.get': {
      res: { message: 'pong' },
      mockTime: 0,
    },
    '/example/items.get': ({ store }) => ({
      res: (store.get('items') as Item[] | undefined) ?? initialItems,
      mockTime: 0,
    }),
    '/example/items.post': async ({ json, store }) => {
      const item = await json<Item>();
      const items = (store.get('items') as Item[] | undefined) ?? initialItems;
      store.set('items', [...items, item]);

      return {
        res: item,
        mockTime: 0,
      };
    },
  }),
];

const server = setupServer(...createMockHandlers(modules));

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  resetMockStore();
});

afterAll(() => {
  server.close();
});

describe('Mock Runtime', () => {
  it('支持固定响应及默认成功状态', async () => {
    const response = await fetch('http://mock.test/example/ping');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'pong' });
  });

  it('通过独立 Store 模拟连续状态变化', async () => {
    await fetch('http://mock.test/example/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 2, name: '新增数据' }),
    });

    const response = await fetch('http://mock.test/example/items');
    await expect(response.json()).resolves.toEqual([...initialItems, { id: 2, name: '新增数据' }]);
  });

  it('拒绝非法或重复的 Mock Key', () => {
    expect(() =>
      createMockHandlers([
        defineMock({
          'POST /invalid': {
            res: {},
          },
        }),
      ]),
    ).toThrow('/pathname.method');

    expect(() =>
      createMockHandlers([
        defineMock({ '/duplicated.get': { res: {} } }),
        defineMock({ '/duplicated.get': { res: {} } }),
      ]),
    ).toThrow('重复定义');
  });
});
