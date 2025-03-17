
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  SUPPORTED_TOKENS, 
  TokenWithBalance,
  calculateSwapAmount,
  getTokenBalances,
  executeSwap
} from "@/utils/tonswapApi";

export const useSwapForm = (address?: string) => {
  // State management
  const [fromToken, setFromToken] = useState("fipt");
  const [toToken, setToToken] = useState("ton");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);
  const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
  const [exchangeRate, setExchangeRate] = useState(0);

  // Fetch token balances when address changes
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balances = await getTokenBalances(address);
        
        // Create token list with balances
        const tokenList = Object.values(SUPPORTED_TOKENS).map(token => ({
          ...token,
          balance: balances[token.id] || 0,
          price: 0 // Will be updated if price API is implemented
        }));
        
        setTokens(tokenList);
      } catch (error) {
        console.error("Error fetching token balances:", error);
        toast.error("Failed to fetch token balances");
      }
    };

    fetchBalances();
  }, [address]);

  // Handle token swap positions
  const handleSwapPositions = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    
    // Recalculate the rate in reverse direction
    if (fromAmount && toAmount) {
      setExchangeRate(parseFloat(toAmount) / parseFloat(fromAmount));
    }
  };

  // Calculate the exchange amount using the API
  const handleFromAmountChange = async (value: string) => {
    setFromAmount(value);
    
    if (!value || isNaN(parseFloat(value))) {
      setToAmount("");
      setExchangeRate(0);
      setPriceImpact(0);
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const amount = parseFloat(value);
      const swapResult = await calculateSwapAmount(fromToken, toToken, amount);
      
      setToAmount(swapResult.resultAmount.toFixed(6));
      setExchangeRate(swapResult.rate);
      setPriceImpact(swapResult.priceImpact);
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      toast.error("Failed to calculate swap amount");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleToAmountChange = async (value: string) => {
    setToAmount(value);
    
    if (!value || isNaN(parseFloat(value))) {
      setFromAmount("");
      setExchangeRate(0);
      setPriceImpact(0);
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const amount = parseFloat(value);
      const swapResult = await calculateSwapAmount(toToken, fromToken, amount);
      
      setFromAmount(swapResult.resultAmount.toFixed(6));
      setExchangeRate(1 / swapResult.rate);
      setPriceImpact(swapResult.priceImpact);
    } catch (error) {
      console.error("Error calculating reverse swap amount:", error);
      toast.error("Failed to calculate swap amount");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async () => {
    if (!fromAmount || !toAmount) {
      toast.error("Please enter an amount");
      return;
    }
    
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    const fromTokenData = tokens.find(t => t.id === fromToken);
    const numFromAmount = parseFloat(fromAmount);
    
    if (numFromAmount > (fromTokenData?.balance || 0)) {
      toast.error(`Insufficient ${fromTokenData?.name} balance`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Execute the swap using Tonswap API
      const result = await executeSwap(
        fromToken,
        toToken,
        numFromAmount,
        address || "",
        parseFloat(slippage)
      );
      
      if (result.success) {
        toast.success("Swap successful! Transaction hash: " + result.txHash);
        
        // Reset form
        setFromAmount("");
        setToAmount("");
        
        // Refresh balances after swap
        const balances = await getTokenBalances(address);
        const updatedTokens = tokens.map(token => ({
          ...token,
          balance: balances[token.id] || 0
        }));
        setTokens(updatedTokens);
      } else {
        toast.error(result.error || "Swap failed");
      }
    } catch (error) {
      console.error("Error executing swap:", error);
      toast.error("Failed to execute swap");
    } finally {
      setIsLoading(false);
    }
  };

  const fromTokenData = tokens.find(t => t.id === fromToken);
  const toTokenData = tokens.find(t => t.id === toToken);

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
