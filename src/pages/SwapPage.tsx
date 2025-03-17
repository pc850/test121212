
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Info } from "lucide-react";
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

// Define token types with their properties
const tokens = [
  { id: "fipt", name: "FIPT", balance: 1250, icon: "🪙" },
  { id: "ton", name: "TON", balance: 2.5, icon: "💎" },
  { id: "usdt", name: "USDT", balance: 15.75, icon: "💵" },
];

const SwapPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "FIPT - Swap";
  }, []);

  const [fromToken, setFromToken] = useState(tokens[0].id);
  const [toToken, setToToken] = useState(tokens[1].id);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("1");

  // Handle token swap positions
  const handleSwapPositions = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Calculate the exchange amount (simple mock calculation)
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Mock exchange rate: 1 FIPT = 0.002 TON, 1 TON = 500 FIPT, 1 TON = 10 USDT, 1 USDT = 0.1 TON
    // These are just placeholder rates for the demo
    let rate = 1;
    
    if (fromToken === "fipt" && toToken === "ton") {
      rate = 0.002;
    } else if (fromToken === "ton" && toToken === "fipt") {
      rate = 500;
    } else if (fromToken === "ton" && toToken === "usdt") {
      rate = 10;
    } else if (fromToken === "usdt" && toToken === "ton") {
      rate = 0.1;
    } else if (fromToken === "fipt" && toToken === "usdt") {
      rate = 0.02;
    } else if (fromToken === "usdt" && toToken === "fipt") {
      rate = 50;
    }
    
    const numValue = parseFloat(value) || 0;
    setToAmount((numValue * rate).toFixed(6));
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    // Calculate the reverse rate
    let rate = 1;
    
    if (toToken === "fipt" && fromToken === "ton") {
      rate = 0.002;
    } else if (toToken === "ton" && fromToken === "fipt") {
      rate = 500;
    } else if (toToken === "ton" && fromToken === "usdt") {
      rate = 10;
    } else if (toToken === "usdt" && fromToken === "ton") {
      rate = 0.1;
    } else if (toToken === "fipt" && fromToken === "usdt") {
      rate = 0.02;
    } else if (toToken === "usdt" && fromToken === "fipt") {
      rate = 50;
    }
    
    const numValue = parseFloat(value) || 0;
    setFromAmount((numValue * rate).toFixed(6));
  };

  const handleSubmit = () => {
    if (!fromAmount || !toAmount) {
      toast.error("Please enter an amount");
      return;
    }
    
    const fromTokenData = tokens.find(t => t.id === fromToken);
    const numFromAmount = parseFloat(fromAmount);
    
    if (numFromAmount > (fromTokenData?.balance || 0)) {
      toast.error(`Insufficient ${fromTokenData?.name} balance`);
      return;
    }
    
    // Show success message (in a real app, this would be where the swap is executed)
    toast.success("Swap initiated! This is a demo, no actual swap is performed.");
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
                Balance: {fromTokenData?.balance} {fromTokenData?.name}
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
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-fipt-blue"
                  onClick={() => {
                    const bal = fromTokenData?.balance.toString() || "0";
                    setFromAmount(bal);
                    handleFromAmountChange(bal);
                  }}
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
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          
          {/* To Token */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-fipt-muted">To</label>
              <span className="text-xs text-fipt-muted">
                Balance: {toTokenData?.balance} {toTokenData?.name}
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
              <Input
                type="number"
                placeholder="0.00"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                className="flex-1"
              />
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
                1 {fromTokenData?.name} ≈ {
                  fromToken === "fipt" && toToken === "ton" ? "0.002" :
                  fromToken === "ton" && toToken === "fipt" ? "500" :
                  fromToken === "ton" && toToken === "usdt" ? "10" :
                  fromToken === "usdt" && toToken === "ton" ? "0.1" :
                  fromToken === "fipt" && toToken === "usdt" ? "0.02" :
                  fromToken === "usdt" && toToken === "fipt" ? "50" : "1"
                } {toTokenData?.name}
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
            disabled={!fromAmount || !toAmount || fromAmount === "0" || toAmount === "0"}
          >
            Swap Tokens
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
              <span className="font-medium text-green-500">&lt; 0.01%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
