
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { 
  SUPPORTED_TOKENS, 
  TokenWithBalance,
  calculateSwapAmount,
  getTokenBalances,
  executeSwap
} from "@/utils/tonswapApi";

const SwapPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "FIPT - Swap";
  }, []);

  // Connect to wallet
  const { connected, address } = useTonkeeperWallet();

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
    
    if (!connected) {
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
      // Execute the swap
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

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Page Header */}
      <div className="p-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-bold text-fipt-dark">Swap</h1>
        <p className="text-sm text-fipt-muted">Exchange tokens seamlessly</p>
      </div>
      
      {/* Swap Container */}
      <div className="flex-1 px-4 py-6">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 mb-4">
          {/* From Token */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-fipt-muted">From</label>
              <span className="text-xs text-fipt-muted">
                Balance: {fromTokenData?.balance || 0} {fromTokenData?.name}
              </span>
            </div>
            <div className="flex gap-2">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-1/3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map(token => (
                    token.id !== toToken && (
                      <SelectItem key={token.id} value={token.id}>
                        <div className="flex items-center gap-2">
                          <span>{token.icon}</span>
                          <span>{token.name}</span>
                        </div>
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="pr-16"
                  disabled={isLoading}
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-fipt-blue"
                  onClick={() => {
                    const bal = fromTokenData?.balance.toString() || "0";
                    setFromAmount(bal);
                    handleFromAmountChange(bal);
                  }}
                  disabled={isLoading}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>
          
          {/* Swap Direction Button */}
          <div className="flex justify-center my-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-2 border-gray-200"
              onClick={handleSwapPositions}
              disabled={isLoading || isCalculating}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          
          {/* To Token */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-fipt-muted">To</label>
              <span className="text-xs text-fipt-muted">
                Balance: {toTokenData?.balance || 0} {toTokenData?.name}
              </span>
            </div>
            <div className="flex gap-2">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-1/3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map(token => (
                    token.id !== fromToken && (
                      <SelectItem key={token.id} value={token.id}>
                        <div className="flex items-center gap-2">
                          <span>{token.icon}</span>
                          <span>{token.name}</span>
                        </div>
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  className={cn(isCalculating && "text-gray-400")}
                  disabled={isLoading || isCalculating}
                />
                {isCalculating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Exchange Rate */}
          <div className="p-3 rounded-lg bg-gray-50 my-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-fipt-muted">
                <Info className="h-4 w-4" />
                <span>Exchange Rate</span>
              </div>
              <span className="text-sm font-medium">
                {exchangeRate ? 
                  `1 ${fromTokenData?.name} ≈ ${exchangeRate.toFixed(6)} ${toTokenData?.name}` :
                  "Enter an amount to see rate"
                }
              </span>
            </div>
          </div>
          
          {/* Slippage Settings */}
          <div className="mb-6">
            <label className="text-sm font-medium text-fipt-muted mb-2 block">Slippage Tolerance</label>
            <div className="flex gap-2">
              {["0.5", "1", "2"].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 text-sm", 
                    slippage === value && "bg-fipt-blue/10 border-fipt-blue text-fipt-blue"
                  )}
                  onClick={() => setSlippage(value)}
                  disabled={isLoading}
                >
                  {value}%
                </Button>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Swap Button */}
          <Button 
            className="w-full py-6 text-base font-semibold"
            onClick={handleSubmit}
            disabled={!fromAmount || !toAmount || isLoading || !connected}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Swapping...</>
            ) : !connected ? (
              "Connect Wallet to Swap"
            ) : (
              "Swap Tokens"
            )}
          </Button>
        </div>
        
        {/* Transaction Details */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-medium text-fipt-dark mb-3">Transaction Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-fipt-muted">Minimum received</span>
              <span className="font-medium">{
                toAmount ? 
                (parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6) :
                "0.00"
              } {toTokenData?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-fipt-muted">Network Fee</span>
              <span className="font-medium">~0.01 TON</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-fipt-muted">Price Impact</span>
              <span className={cn(
                "font-medium",
                priceImpact > 0.05 ? "text-red-500" : 
                priceImpact > 0.02 ? "text-yellow-500" : "text-green-500"
              )}>
                {priceImpact > 0 ? `${(priceImpact * 100).toFixed(2)}%` : '<0.01%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
