import { setupWorker } from 'msw/browser';
import mockModules from '../../mock';
import { createMockHandlers } from './runtime';

export const worker = setupWorker(...createMockHandlers(mockModules));

export const startMock = async (): Promise<void> => {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
};
