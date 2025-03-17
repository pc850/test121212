
import { TonClient, toNano, Address } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";

// Initialize the TonClient for testnet
const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

// Initialize the DEX router
const router = client.open(
  DEX.v2_1.Router.create(
    "kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v" // CPI Router v2.1.0
  )
);

// Initialize the proxyTon for TON swaps
const proxyTon = pTON.v2_1.create(
  "kQACS30DNoUQ7NfApPvzh7eBmSZ9L4ygJ-lkNWtba8TQT-Px" // pTON v2.1.0
);

// Token contract addresses for testnet
export const TEST_TOKENS = {
  TON: "TON", // Native TON
  RED: "kQDLvsZol3juZyOAVG8tWsJntOxeEZWEaWCbbSjYakQpuYN5", // TestRED
  BLUE: "kQB_TOJSB7q3-Jm1O8s0jKFtqLElZDPjATs5uJGsujcjznq3", // TestBlue
};

// Token mapping from our app tokens to StonFi addresses
const TOKEN_MAPPING: Record<string, string> = {
  fipt: TEST_TOKENS.RED, // Mapping FIPT to TestRED for testnet
  ton: TEST_TOKENS.TON,  // TON stays as TON
  usdt: TEST_TOKENS.BLUE, // Mapping USDT to TestBlue for testnet
};

/**
 * Get transaction parameters for a TON to Jetton swap
 */
export const getTonToJettonSwapParams = async (
  userWalletAddress: string,
  toTokenAddress: string,
  amount: number,
  minReceiveAmount: string = "1"
) => {
  if (!userWalletAddress) {
    throw new Error("Wallet address is required");
  }

  try {
    const txParams = await router.getSwapTonToJettonTxParams({
      userWalletAddress: userWalletAddress,
      proxyTon: proxyTon,
      offerAmount: toNano(amount.toString()),
      askJettonAddress: toTokenAddress,
      minAskAmount: minReceiveAmount,
      queryId: Date.now(), // Use current timestamp as query ID
    });

    return txParams;
  } catch (error) {
    console.error("Error getting TON to Jetton swap parameters:", error);
    throw error;
  }
};

/**
 * Get transaction parameters for a Jetton to TON swap
 */
export const getJettonToTonSwapParams = async (
  userWalletAddress: string,
  fromTokenAddress: string,
  amount: number,
  minReceiveAmount: string = "1"
) => {
  if (!userWalletAddress) {
    throw new Error("Wallet address is required");
  }

  try {
    const txParams = await router.getSwapJettonToTonTxParams({
      userWalletAddress: userWalletAddress,
      offerJettonAddress: fromTokenAddress,
      offerAmount: toNano(amount.toString()),
      minAskAmount: minReceiveAmount,
      proxyTon: proxyTon, // Adding the missing proxyTon parameter
      queryId: Date.now(), // Use current timestamp as query ID
    });

    return txParams;
  } catch (error) {
    console.error("Error getting Jetton to TON swap parameters:", error);
    throw error;
  }
};

/**
 * Get transaction parameters for a Jetton to Jetton swap
 */
export const getJettonToJettonSwapParams = async (
  userWalletAddress: string,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: number,
  minReceiveAmount: string = "1"
) => {
  if (!userWalletAddress) {
    throw new Error("Wallet address is required");
  }

  try {
    const txParams = await router.getSwapJettonToJettonTxParams({
      userWalletAddress: userWalletAddress,
      offerJettonAddress: fromTokenAddress,
      offerAmount: toNano(amount.toString()),
      askJettonAddress: toTokenAddress,
      minAskAmount: minReceiveAmount,
      proxyTon: proxyTon, // Adding the missing proxyTon parameter
      queryId: Date.now(), // Use current timestamp as query ID
    });

    return txParams;
  } catch (error) {
    console.error("Error getting Jetton to Jetton swap parameters:", error);
    throw error;
  }
};

/**
 * Get swap parameters based on token types
 */
export const getSwapParams = async (
  fromToken: string,
  toToken: string,
  amount: number,
  walletAddress: string,
  minAmount: string = "1"
) => {
  // Map app token IDs to StonFi addresses
  const fromTokenAddress = TOKEN_MAPPING[fromToken];
  const toTokenAddress = TOKEN_MAPPING[toToken];

  if (!fromTokenAddress || !toTokenAddress) {
    throw new Error("Invalid token selection");
  }

  // TON to Jetton swap
  if (fromToken === "ton") {
    return getTonToJettonSwapParams(walletAddress, toTokenAddress, amount, minAmount);
  }
  
  // Jetton to TON swap
  if (toToken === "ton") {
    return getJettonToTonSwapParams(walletAddress, fromTokenAddress, amount, minAmount);
  }
  
  // Jetton to Jetton swap
  return getJettonToJettonSwapParams(walletAddress, fromTokenAddress, toTokenAddress, amount, minAmount);
};

/**
 * Execute a swap using StonFi SDK
 * Note: This is a mock implementation that would be integrated with a wallet connector
 */
export const executeStonfiSwap = async (
  fromToken: string,
  toToken: string,
  amount: number,
  walletAddress: string,
  minAmount: string = "1"
) => {
  try {
    // Get swap parameters
    const txParams = await getSwapParams(fromToken, toToken, amount, walletAddress, minAmount);
    
    // In a real implementation, this would be sent to the wallet for signing
    // For now, we'll just return the parameters
    console.log("StonFi swap transaction parameters:", txParams);
    
    // Mock transaction success
    return {
      success: true,
      txHash: `stonfi_${Date.now()}`,
      txParams
    };
  } catch (error) {
    console.error("Error executing StonFi swap:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in StonFi swap"
    };
  }
};
