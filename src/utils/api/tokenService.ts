
/**
 * Token-related API operations
 */

import { API_BASE_URL, handleApiError } from './config';
import { TokenWithBalance } from './types';

/**
 * Fetch current token prices from TonSwap
 * @returns Promise with token price data
 */
export const fetchTokenPrices = async (): Promise<Record<string, number>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tokens/prices`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.prices;
  } catch (error) {
    return handleApiError(error, {
      fipt: 0.02,
      ton: 10.00,
      usdt: 1.00
    }, "fetching token prices");
  }
};

/**
 * Get token balances for a wallet
 * @param walletAddress User's wallet address
 * @returns Promise with token balances
 */
export const getTokenBalances = async (
  walletAddress?: string
): Promise<Record<string, number>> => {
  try {
    if (!walletAddress) {
      // Return mock balances for demonstration if no wallet connected
      return {
        fipt: 1250,
        ton: 2.5,
        usdt: 15.75
      };
    }
    
    const response = await fetch(
      `${API_BASE_URL}/wallets/${walletAddress}/balances`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.balances;
  } catch (error) {
    return handleApiError(error, {
      fipt: 1250,
      ton: 2.5,
      usdt: 15.75
    }, "fetching token balances");
  }
};
