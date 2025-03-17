
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
  console.log(`Setting up connection timeout for ${duration}ms`);
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
    console.log('Clearing existing connection timeout');
    clearTimeout(timeout);
  }
};

/**
 * Setup a retry timer that will show retry UI after a given period
 */
export const setupRetryTimer = (
  duration: number,
  onRetryAvailable: () => void
): ReturnType<typeof setTimeout> => {
  console.log(`Setting up retry timer for ${duration}ms`);
  return setTimeout(() => {
    console.log(`Retry timer finished after ${duration}ms`);
    onRetryAvailable();
  }, duration);
};
