
/**
 * Shared types for the TonSwap API
 */

// Token details interface
export interface TokenDetails {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  price: number;
  icon?: string;
}

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
export interface SwapResult {
  resultAmount: number;
  rate: number;
  priceImpact: number;
  slippage: number;
}

// Transaction result interface
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
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
