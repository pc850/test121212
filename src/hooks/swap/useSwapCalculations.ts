
import { useState } from "react";
import { toast } from "sonner";
import { calculateSwapAmount } from "@/utils/api";

export const useSwapCalculations = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);

  const calculateFromAmount = async (
    fromToken: string,
    toToken: string,
    value: string
  ): Promise<string> => {
    if (!value || isNaN(parseFloat(value))) {
      setExchangeRate(0);
      setPriceImpact(0);
      return "";
    }
    
    setIsCalculating(true);
    
    try {
      const amount = parseFloat(value);
      const swapResult = await calculateSwapAmount(fromToken, toToken, amount);
      
      setExchangeRate(swapResult.rate);
      setPriceImpact(swapResult.priceImpact);
      
      return swapResult.resultAmount.toFixed(6);
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      toast.error("Failed to calculate swap amount");
      return "";
    } finally {
      setIsCalculating(false);
    }
  };

  const calculateToAmount = async (
    fromToken: string,
    toToken: string,
    value: string
  ): Promise<string> => {
    if (!value || isNaN(parseFloat(value))) {
      setExchangeRate(0);
      setPriceImpact(0);
      return "";
    }
    
    setIsCalculating(true);
    
    try {
      const amount = parseFloat(value);
      const swapResult = await calculateSwapAmount(toToken, fromToken, amount);
      
      setExchangeRate(1 / swapResult.rate);
      setPriceImpact(swapResult.priceImpact);
      
      return swapResult.resultAmount.toFixed(6);
    } catch (error) {
      console.error("Error calculating reverse swap amount:", error);
      toast.error("Failed to calculate swap amount");
      return "";
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    isCalculating,
    priceImpact,
    exchangeRate,
    calculateFromAmount,
    calculateToAmount
  };
};
