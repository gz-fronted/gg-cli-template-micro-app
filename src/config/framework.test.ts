import { describe, expect, it } from 'vitest';

import { shouldUseFramework } from './framework';

describe('shouldUseFramework', () => {
  it('only enables the framework shell in development when explicitly configured', () => {
    expect(shouldUseFramework(true, 'true')).toBe(true);
  });

  it.each([
    [false, 'true'],
    [true, 'false'],
    [true, undefined],
  ])('returns false for non-matching configuration: %s, %s', (isDevelopment, frameworkEnabled) => {
    expect(shouldUseFramework(isDevelopment, frameworkEnabled)).toBe(false);
  });
});
