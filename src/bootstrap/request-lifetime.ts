import { GzFetchError, type GzFetchMiddleware } from '@gz-fronted/gz-pc/fetch';

// 每次挂载持有自己的取消域；已进入该域的请求不会借用下一次挂载的 Signal。
export const createRequestLifetime = () => {
  const controller = new AbortController();
  const assertActive = (): void => {
    if (controller.signal.aborted) {
      throw new GzFetchError('应用已卸载', { type: 'CANCELED_ERROR' });
    }
  };
  const middleware: GzFetchMiddleware = {
    onRequest: (config) => {
      assertActive();
      return {
        ...config,
        signal: config.signal
          ? AbortSignal.any([config.signal, controller.signal])
          : controller.signal,
      };
    },
    onResponse: (data) => {
      assertActive();
      return data;
    },
  };

  return { middleware, dispose: () => controller.abort() };
};
