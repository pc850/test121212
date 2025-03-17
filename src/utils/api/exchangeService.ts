
/**
 * Exchange rate API operations
 */

import { API_BASE_URL, handleApiError } from './config';

/**
 * Get exchange rate between two tokens
 * @param fromToken Source token ID
 * @param toToken Target token ID
 * @returns Promise with the exchange rate
 */
export const getExchangeRate = async (
  fromToken: string,
  toToken: string
): Promise<number> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/pairs/rate?fromToken=${fromToken}&toToken=${toToken}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.rate;
  } catch (error) {
    // Fallback to default rates in case of API failure
    const fallbackRates: Record<string, Record<string, number>> = {
      fipt: {
        ton: 0.002,
        usdt: 0.02
      },
      ton: {
        fipt: 500,
        usdt: 10
      },
      usdt: {
        fipt: 50,
        ton: 0.1
      }
    };
    
    return handleApiError(error, fallbackRates[fromToken]?.[toToken] || 0, "getting exchange rate");
  }
};
