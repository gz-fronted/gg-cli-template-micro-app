let mockStartPromise: Promise<void> | undefined;

export const enableMock = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    return;
  }

  mockStartPromise ??= import('@/mock/browser').then(({ startMock }) => startMock());
  await mockStartPromise;
};

export const disableMock = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCK !== 'true' || !mockStartPromise) return;
  try {
    await mockStartPromise;
    const { worker } = await import('@/mock/browser');
    worker.stop();
  } finally {
    mockStartPromise = undefined;
  }
};
