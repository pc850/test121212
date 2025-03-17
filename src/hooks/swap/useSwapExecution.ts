
import { useState } from "react";
import { toast } from "sonner";
import { executeSwap, getTokenBalances, TokenWithBalance } from "@/utils/api";
import { executeStonfiSwap } from "@/utils/api/stonfiService";

export const useSwapExecution = (
  setTokens: React.Dispatch<React.SetStateAction<TokenWithBalance[]>>,
  tokens: TokenWithBalance[]
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [useStonFi, setUseStonFi] = useState(false);

  const executeSwapTransaction = async (
    fromToken: string,
    toToken: string,
    fromAmount: string,
    address: string | undefined,
    slippage: string
  ) => {
    if (!fromAmount || !address) {
      toast.error(address ? "Please enter an amount" : "Please connect your wallet first");
      return false;
    }
    
    const numFromAmount = parseFloat(fromAmount);
    const fromTokenData = tokens.find(t => t.id === fromToken);
    
    if (numFromAmount > (fromTokenData?.balance || 0)) {
      toast.error(`Insufficient ${fromTokenData?.name} balance`);
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Calculate minimum amount based on slippage
      const slippageValue = parseFloat(slippage) / 100;
      const minAmount = "1"; // In a real implementation, this would be calculated based on expected output and slippage
      
      let result;
      
      if (useStonFi) {
        // Execute the swap using StonFi SDK
        result = await executeStonfiSwap(
          fromToken,
          toToken,
          numFromAmount,
          address,
          minAmount
        );
      } else {
        // Execute the swap using the original implementation
        result = await executeSwap(
          fromToken,
          toToken,
          numFromAmount,
          address,
          parseFloat(slippage)
        );
      }
      
      if (result.success) {
        toast.success(`Swap successful! Transaction hash: ${result.txHash}`);
        
        // Refresh balances after swap
        const balances = await getTokenBalances(address);
        const updatedTokens = tokens.map(token => ({
          ...token,
          balance: balances[token.id] || 0
        }));
        setTokens(updatedTokens);
        return true;
      } else {
        toast.error(result.error || "Swap failed");
        return false;
      }
    } catch (error) {
      console.error("Error executing swap:", error);
      toast.error("Failed to execute swap");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    executeSwapTransaction,
    useStonFi,
    setUseStonFi
  };
};
