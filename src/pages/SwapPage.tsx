
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, ArrowDown, ArrowLeftRight } from "lucide-react";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { getFiptBalance, updateFiptBalance } from "@/utils/walletBalanceUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const SwapPage = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [swapDirection, setSwapDirection] = useState<'points-to-tokens' | 'tokens-to-points'>('points-to-tokens');
  const [isSwapping, setIsSwapping] = useState(false);
  
  const { connected, address } = useTonkeeperWallet();
  const { toast } = useToast();
  
  useEffect(() => {
    // Set page title
    document.title = "FIPT - Swap";
  }, []);

  // Load balance from Supabase when wallet is connected
  useEffect(() => {
    const loadBalance = async () => {
      if (connected && address) {
        setIsLoading(true);
        try {
          console.log("Loading balance for wallet address:", address);
          const balanceFromDB = await getFiptBalance(address);
          console.log("Loaded balance from Supabase:", balanceFromDB);
          setBalance(balanceFromDB);
        } catch (error) {
          console.error("Error loading balance:", error);
          toast({
            title: "Error loading balance",
            description: "Could not retrieve your FIPT balance",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // If wallet is not connected, show 0 balance after a short delay
        setTimeout(() => {
          setBalance(0);
          setIsLoading(false);
        }, 500);
      }
    };
    
    loadBalance();
  }, [connected, address, toast]);

  const handleSwap = async () => {
    if (!connected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap FIPT",
        variant: "default"
      });
      return;
    }

    const amount = parseInt(swapAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive"
      });
      return;
    }

    if (swapDirection === 'points-to-tokens' && (balance === null || amount > balance)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough FIPT points",
        variant: "destructive"
      });
      return;
    }

    setIsSwapping(true);
    try {
      if (swapDirection === 'points-to-tokens') {
        // Deduct points when swapping to tokens
        const newBalance = await updateFiptBalance(address, amount, false);
        setBalance(newBalance);
        
        toast({
          title: "Swap Successful",
          description: `You've swapped ${amount} FIPT points for ${amount} FIPT tokens`,
          variant: "default"
        });
      } else {
        // Add points when swapping from tokens
        const newBalance = await updateFiptBalance(address, amount, true);
        setBalance(newBalance);
        
        toast({
          title: "Swap Successful",
          description: `You've swapped ${amount} FIPT tokens for ${amount} FIPT points`,
          variant: "default"
        });
      }
      
      // Reset swap amount after successful swap
      setSwapAmount('');
    } catch (error) {
      console.error("Error during swap:", error);
      toast({
        title: "Swap Failed",
        description: "There was an error processing your swap",
        variant: "destructive"
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const toggleSwapDirection = () => {
    setSwapDirection(prev => 
      prev === 'points-to-tokens' ? 'tokens-to-points' : 'points-to-tokens'
    );
    setSwapAmount('');
  };

  const maxAmount = () => {
    if (swapDirection === 'points-to-tokens' && balance !== null) {
      setSwapAmount(balance.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 animate-fade-in">
      {/* FIPT Balance Section */}
      <div className="mb-6">
        <Card className="w-full p-4 border border-fipt-blue/20 bg-gradient-to-r from-fipt-blue/10 to-fipt-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-fipt-muted">Your Balance</h2>
              <div className="flex items-center mt-1">
                <Coins className="w-5 h-5 mr-2 text-fipt-blue" />
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <span className="text-2xl font-bold text-fipt-dark">{balance?.toLocaleString()}</span>
                    <span className="ml-1 text-xs font-medium text-fipt-blue">FIPT</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block px-3 py-1 bg-fipt-blue/10 rounded-full text-xs font-medium text-fipt-blue mb-2">
          Swap FIPT
        </div>
        <h1 className="text-2xl font-bold text-fipt-dark">
          {swapDirection === 'points-to-tokens' ? 'Points to Tokens' : 'Tokens to Points'}
        </h1>
        <p className="text-sm text-fipt-muted mt-1">
          {connected 
            ? "Swap your FIPT points for FIPT tokens and vice versa" 
            : "Connect your wallet to start swapping"}
        </p>
      </div>
      
      {/* Swap Card */}
      <Card className="p-5 border-fipt-blue/20">
        <div className="space-y-5">
          {/* From */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-fipt-muted">From</span>
              {swapDirection === 'points-to-tokens' && balance !== null && (
                <button 
                  onClick={maxAmount}
                  className="text-xs text-fipt-blue hover:underline"
                >
                  Max: {balance}
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                placeholder="0.00"
                disabled={!connected || isSwapping}
                className="flex-1"
              />
              <div className="w-1/3">
                <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm flex items-center">
                  {swapDirection === 'points-to-tokens' ? 'FIPT Points' : 'FIPT Tokens'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Swap Direction Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSwapDirection}
              className="rounded-full h-8 w-8"
              disabled={isSwapping}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          
          {/* To */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-fipt-muted">To</span>
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={swapAmount}
                disabled
                placeholder="0.00"
                className="flex-1 bg-gray-50"
              />
              <div className="w-1/3">
                <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm flex items-center">
                  {swapDirection === 'points-to-tokens' ? 'FIPT Tokens' : 'FIPT Points'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!connected || isSwapping || !swapAmount || parseInt(swapAmount, 10) <= 0}
            className="w-full"
          >
            {isSwapping ? (
              <span>Swapping...</span>
            ) : !connected ? (
              <span>Connect Wallet</span>
            ) : !swapAmount || parseInt(swapAmount, 10) <= 0 ? (
              <span>Enter Amount</span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Swap FIPT
              </span>
            )}
          </Button>
        </div>
      </Card>
      
      {/* Swap Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-fipt-dark mb-2">About FIPT Swap</h3>
        <ul className="text-xs text-fipt-muted space-y-2">
          <li>• 1 FIPT Point = 1 FIPT Token</li>
          <li>• No fees for swapping</li>
          <li>• Tokens can be used across the FIPT ecosystem</li>
          <li>• Points can only be used within this app</li>
        </ul>
      </div>
    </div>
  );
};

export default SwapPage;
