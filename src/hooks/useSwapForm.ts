
import { useSwapFormState } from "./swap/useSwapFormState";
import { useSwapCalculations } from "./swap/useSwapCalculations";
import { useSwapExecution } from "./swap/useSwapExecution";
import { toast } from "sonner";

export const useSwapForm = (address?: string) => {
  // Form state management
  const {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    slippage,
    setSlippage,
    tokens,
    setTokens,
    fromTokenData,
    toTokenData,
    handleSwapPositions
  } = useSwapFormState(address);

  // Swap calculation logic
  const {
    isCalculating,
    priceImpact,
    exchangeRate,
    calculateFromAmount,
    calculateToAmount
  } = useSwapCalculations();

  // Swap execution logic
  const {
    isLoading,
    executeSwapTransaction
  } = useSwapExecution(setTokens, tokens);

  // Handler for from amount changes
  const handleFromAmountChange = async (value: string) => {
    setFromAmount(value);
    const calculatedAmount = await calculateFromAmount(fromToken, toToken, value);
    setToAmount(calculatedAmount);
  };

  // Handler for to amount changes
  const handleToAmountChange = async (value: string) => {
    setToAmount(value);
    const calculatedAmount = await calculateToAmount(fromToken, toToken, value);
    setFromAmount(calculatedAmount);
  };

  // Handler for swap submission
  const handleSubmit = async () => {
    const success = await executeSwapTransaction(
      fromToken,
      toToken,
      fromAmount,
      address,
      slippage
    );
    
    if (success) {
      // Reset form
      setFromAmount("");
      setToAmount("");
    }
  };

  return {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    fromAmount,
    toAmount,
    slippage,
    setSlippage,
    isLoading,
    isCalculating,
    priceImpact,
    tokens,
    exchangeRate,
    fromTokenData,
    toTokenData,
    handleSwapPositions,
    handleFromAmountChange,
    handleToAmountChange,
    handleSubmit
  };
};
