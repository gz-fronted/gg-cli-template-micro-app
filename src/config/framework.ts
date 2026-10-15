/**
 * Whether the development-only framework shell should be loaded.
 */
export function shouldUseFramework(
  isDevelopment: boolean,
  frameworkEnabled: string | undefined,
): boolean {
  return isDevelopment && frameworkEnabled === 'true';
}
