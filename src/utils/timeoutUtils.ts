
/**
 * Utilities for managing timeouts and connection states
 */

/**
 * Sets up a timeout for wallet connection
 */
export const setupConnectionTimeout = (
  duration: number,
  onTimeout: () => void
): ReturnType<typeof setTimeout> => {
  return setTimeout(() => {
    console.log(`Connection attempt timed out after ${duration}ms`);
    onTimeout();
  }, duration);
};

/**
 * Clears an existing timeout
 */
export const clearConnectionTimeout = (
  timeout: ReturnType<typeof setTimeout> | null
): void => {
  if (timeout) {
    clearTimeout(timeout);
  }
};
