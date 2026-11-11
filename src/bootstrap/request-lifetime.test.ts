import { describe, expect, it } from 'vitest';
import { createRequestLifetime } from './request-lifetime';

describe('应用请求生命周期', () => {
  it('卸载取消全部请求，同时保留调用方主动取消能力', async () => {
    const first = createRequestLifetime();
    const caller = new AbortController();
    const request = await first.middleware.onRequest!({
      url: '/slow',
      method: 'GET',
      signal: caller.signal,
    });
    const other = await first.middleware.onRequest!({ url: '/slow2', method: 'GET' });
    caller.abort();
    expect(request.signal?.aborted).toBe(true);
    expect(other.signal?.aborted).toBe(false);
    first.dispose();
    expect(other.signal?.aborted).toBe(true);
    expect(() =>
      first.middleware.onResponse!({}, { config: other, status: 200, headers: {} }),
    ).toThrow('应用已卸载');
    expect(() => first.middleware.onRequest!({ url: '/late', method: 'GET' })).toThrow(
      '应用已卸载',
    );
    const second = createRequestLifetime();
    const fresh = await second.middleware.onRequest!({ url: '/new', method: 'GET' });
    expect(fresh.signal?.aborted).toBe(false);
    first.dispose();
    expect(fresh.signal?.aborted).toBe(false);
    second.dispose();
  });
});
