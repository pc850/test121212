
/**
 * Swap-related API operations
 */

import { API_BASE_URL, handleApiError } from './config';
import { SwapResult, TransactionResult } from './types';
import { getExchangeRate } from './exchangeService';

/**
 * Calculate the estimated amount for a token swap
 * @param fromTokenId Source token ID
 * @param toTokenId Target token ID
 * @param amount Amount to be swapped
 * @returns Promise with the estimated result amount
 */
export const calculateSwapAmount = async (
  fromTokenId: string,
  toTokenId: string,
  amount: number
): Promise<SwapResult> => {
  try {
    if (!amount) return { resultAmount: 0, rate: 0, priceImpact: 0, slippage: 0 };
    
    const response = await fetch(
      `${API_BASE_URL}/swap/estimate?fromToken=${fromTokenId}&toToken=${toTokenId}&amount=${amount}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      resultAmount: data.resultAmount,
      rate: data.rate,
      priceImpact: data.priceImpact,
      slippage: data.slippage || 0.01
    };
  } catch (error) {
    console.error("Error calculating swap amount:", error);
    
    // Fallback to simplified calculation in case of API failure
    try {
      const rate = await getExchangeRate(fromTokenId, toTokenId);
      const resultAmount = amount * rate;
      
      // Simplified price impact estimation
      const priceImpact = amount > 1000 ? 0.05 : amount > 100 ? 0.02 : 0.01;
      
      return {
        resultAmount,
        rate,
        priceImpact,
        slippage: 0.01
      };
    } catch (innerError) {
      console.error("Fallback calculation failed:", innerError);
      throw new Error("Failed to calculate swap amount");
    }
  }
};

/**
 * Execute a token swap transaction
 * @param fromTokenId Source token ID
 * @param toTokenId Target token ID
 * @param amount Amount to swap
 * @param walletAddress User's wallet address
 * @param slippageTolerance Slippage tolerance percentage
 * @returns Promise with transaction result
 */
export const executeSwap = async (
  fromTokenId: string,
  toTokenId: string,
  amount: number,
  walletAddress: string,
  slippageTolerance: number
): Promise<TransactionResult> => {
  try {
    if (!walletAddress) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const response = await fetch(`${API_BASE_URL}/swap/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromToken: fromTokenId,
        toToken: toTokenId,
        amount,
        walletAddress,
        slippageTolerance
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      txHash: data.txHash
    };
  } catch (error) {
    return handleApiError(error, {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during swap"
    }, "executing swap");
  }
};
