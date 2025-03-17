
import { useState, useEffect } from "react";
import { SUPPORTED_TOKENS, TokenWithBalance, getTokenBalances } from "@/utils/api";

export const useSwapFormState = (address?: string) => {
  // Form state
  const [fromToken, setFromToken] = useState("fipt");
  const [toToken, setToToken] = useState("ton");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [tokens, setTokens] = useState<TokenWithBalance[]>([]);

  // Fetch token balances
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
  };

  const fromTokenData = tokens.find(t => t.id === fromToken);
  const toTokenData = tokens.find(t => t.id === toToken);

  return {
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
  };
};
