import { afterEach, describe, expect, it, vi } from 'vitest';
const mock = vi.hoisted(() => ({ start: vi.fn(), stop: vi.fn() }));
vi.mock('@/mock/browser', () => ({ startMock: mock.start, worker: { stop: mock.stop } }));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
});

describe('Mock 生命周期', () => {
  it('生产关闭 Mock 时不启动或停止 Worker', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    const { enableMock, disableMock } = await import('./enable-mock');
    await enableMock();
    await disableMock();
    expect(mock.start).not.toHaveBeenCalled();
    expect(mock.stop).not.toHaveBeenCalled();
  });
  it('合并启动，关闭后允许重新启动', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    mock.start.mockResolvedValue(undefined);
    const { enableMock, disableMock } = await import('./enable-mock');
    await Promise.all([enableMock(), enableMock()]);
    expect(mock.start).toHaveBeenCalledTimes(1);
    await disableMock();
    expect(mock.stop).toHaveBeenCalledTimes(1);
    await enableMock();
    expect(mock.start).toHaveBeenCalledTimes(2);
    await disableMock();
    expect(mock.stop).toHaveBeenCalledTimes(2);
  });
});
