import { configureGzFetch } from '@gz-fronted/gz-pc/fetch';
import { useGlobalStore } from '@/store/useGlobalStore';

const getRuntimeToken = (): string | undefined => useGlobalStore.getState().token ?? undefined;

export const configureRequest = (): void => {
  configureGzFetch({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    getToken: getRuntimeToken,
    showErrorMessage: true,
  });
};
