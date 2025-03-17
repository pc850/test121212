
import { useEffect, useState } from "react";
import EarnButton from "@/components/EarnButton";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { getFiptBalance, updateFiptBalance } from "@/utils/walletBalanceUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const EarnPage = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connected, address } = useTonkeeperWallet();
  const { toast } = useToast();
  
  useEffect(() => {
    // Set page title
    document.title = "FIPT - Earn";
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

  // Function to increase balance with each button tap
  const handleEarnPoints = async (points: number) => {
    if (connected && address) {
      try {
        console.log(`Updating balance for wallet ${address} with ${points} points`);
        const newBalance = await updateFiptBalance(address, points, true);
        console.log("New balance after update:", newBalance);
        setBalance(newBalance);
        
        // Show success toast for larger point earnings
        if (points >= 10) {
          toast({
            title: "Points Earned!",
            description: `You've earned ${points} FIPT points.`,
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Error updating balance:", error);
        toast({
          title: "Error earning points",
          description: "Could not update your FIPT balance",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to earn FIPT",
        variant: "default"
      });
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
            <div className="bg-white/80 px-3 py-1 rounded-full shadow-sm">
              <span className="text-xs font-medium text-fipt-dark">Rank #42</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block px-3 py-1 bg-fipt-blue/10 rounded-full text-xs font-medium text-fipt-blue mb-2">
          Click to Earn
        </div>
        <h1 className="text-2xl font-bold text-fipt-dark">Earn FIPT Points</h1>
        <p className="text-sm text-fipt-muted mt-1">
          {connected 
            ? "Tap the button below to earn FIPT points" 
            : "Connect your wallet to start earning FIPT points"}
        </p>
      </div>
      
      {/* Earn Button */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <EarnButton onEarn={handleEarnPoints} disabled={!connected} />
      </div>
      
      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-fipt-muted mb-1">Today's Earnings</h3>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <p className="text-xl font-bold text-fipt-dark">{balance} FIPT</p>
          )}
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-fipt-muted mb-1">Rank</h3>
          <p className="text-xl font-bold text-fipt-dark">#42</p>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;
