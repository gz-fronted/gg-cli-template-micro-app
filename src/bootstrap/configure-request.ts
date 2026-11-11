import { configureGzFetch } from '@gz-fronted/gz-pc/fetch';
import { useGlobalStore } from '@/store/useGlobalStore';
import { createRequestLifetime } from './request-lifetime';

const getRuntimeToken = (): string | undefined => useGlobalStore.getState().token ?? undefined;

export const configureRequest = (): (() => void) => {
  const lifetime = createRequestLifetime();
  configureGzFetch({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    getToken: getRuntimeToken,
    middlewares: [lifetime.middleware],
    showErrorMessage: true,
    unauthorized: {
      enabled: true,
    },
  });
  return lifetime.dispose;
};
