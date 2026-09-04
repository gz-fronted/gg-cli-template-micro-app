import { configureGzFetch } from '@gz-fronted/gz-pc/fetch';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { configureRequest } from './configure-request';

vi.mock('@gz-fronted/gz-pc/fetch', () => ({
  configureGzFetch: vi.fn(),
}));

describe('configureRequest', () => {
  beforeEach(() => {
    vi.mocked(configureGzFetch).mockClear();
  });

  it('默认开启统一 HTTP 401 反馈', () => {
    configureRequest();

    expect(configureGzFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        unauthorized: {
          enabled: true,
        },
      }),
    );
  });
});
