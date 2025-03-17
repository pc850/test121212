
/**
 * TonSwap API configuration
 */

export const API_BASE_URL = 'https://api.tonswap.org/v1';

/**
 * Common error handling for API requests
 */
export const handleApiError = (error: unknown, fallbackValue: any, errorContext: string): any => {
  console.error(`Error ${errorContext}:`, error);
  return fallbackValue;
};
