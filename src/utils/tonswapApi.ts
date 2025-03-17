
/**
 * TonSwap DEX API integration
 * Provides functions to fetch token prices and execute swaps on TonSwap DEX
 */

const API_BASE_URL = 'https://api.tonswap.org/v1';

// Token details interface
export interface TokenDetails {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  price: number;
  icon?: string;
}

// Supported tokens with their contract addresses
export const SUPPORTED_TOKENS = {
  FIPT: { 
    id: "fipt",
    address: "EQA0i8-CdGnF_DhUHHf92R1ONH6R1N_j2nUlD5-Bae1v_Qt5", 
    decimals: 9,
    name: "FIPT",
    symbol: "FIPT",
    icon: "🪙"
  },
  TON: { 
    id: "ton",
    address: "toncoin", 
    decimals: 9,
    name: "TON",
    symbol: "TON", 
    icon: "💎"
  },
  USDT: { 
    id: "usdt",
    address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA", 
    decimals: 6,
    name: "USDT",
    symbol: "USDT",
    icon: "💵"
  }
};

// Token with full details including balance
export interface TokenWithBalance extends TokenDetails {
  balance: number;
}

// Pair data for token exchange rates
export interface PairData {
  fromToken: string;
  toToken: string;
  rate: number;
  priceImpact: number;
  slippage: number;
  liquidityFee: number;
}

// Swap result interface
interface SwapResult {
  resultAmount: number;
  rate: number;
  priceImpact: number;
  slippage: number;
}

// Transaction result interface
interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

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
    console.error("Error fetching token prices:", error);
    // Fallback to default values in case of API failure
    return {
      fipt: 0.02,
      ton: 10.00,
      usdt: 1.00
    };
  }
};

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
    console.error("Error getting exchange rate:", error);
    
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
    
    return fallbackRates[fromToken]?.[toToken] || 0;
  }
};

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
    console.error("Error executing swap:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during swap"
    };
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
    console.error("Error fetching token balances:", error);
    
    // Fallback to default values in case of API failure
    return {
      fipt: 1250,
      ton: 2.5,
      usdt: 15.75
    };
  }
};
