let mockStartPromise: Promise<void> | undefined;

export const enableMock = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    return;
  }

  mockStartPromise ??= import('@/mock/browser').then(({ startMock }) => startMock());
  await mockStartPromise;
};
