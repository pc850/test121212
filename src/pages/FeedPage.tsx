
import { useEffect, useState } from "react";
import TikTokScrollFeed from "@/components/TikTokScrollFeed";
import { useToast } from "@/hooks/use-toast";
import { mockFeedData } from "@/data/mockFeedData";
import FeedHeader from "@/components/feed/FeedHeader";
import FeedTabs from "@/components/feed/FeedTabs";
import VerticalFeed from "@/components/feed/VerticalFeed";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { getFiptBalance, updateFiptBalance } from "@/utils/walletBalanceUtils";

const FeedPage = () => {
  const [feedData, setFeedData] = useState(mockFeedData);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebcams, setShowWebcams] = useState(false);
  const { toast } = useToast();
  const { connected, address } = useTonkeeperWallet();
  
  // Get the user's balance from Supabase if wallet is connected, otherwise from local storage
  const [balance, setBalance] = useState<number>(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

  // Load balance based on wallet connection status
  useEffect(() => {
    const loadBalance = async () => {
      setIsBalanceLoading(true);
      
      if (connected && address) {
        // Get balance from Supabase
        try {
          const fiptBalance = await getFiptBalance(address);
          setBalance(fiptBalance);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
          toast({
            title: "Error loading balance",
            description: "Could not retrieve your FIPT balance",
            variant: "destructive"
          });
          
          // Fallback to local storage if Supabase fails
          const savedBalance = localStorage.getItem('fiptBalance');
          setBalance(savedBalance ? parseInt(savedBalance, 10) : 0);
        }
      } else {
        // Use local storage for non-connected users
        const savedBalance = localStorage.getItem('fiptBalance');
        setBalance(savedBalance ? parseInt(savedBalance, 10) : 0);
      }
      
      setIsBalanceLoading(false);
    };
    
    loadBalance();
  }, [connected, address, toast]);

  useEffect(() => {
    // Set page title
    document.title = "FIPT - Feed";
  }, []);

  // Function to update the balance (for FeedCard interactions)
  const updateBalance = async (amount: number) => {
    if (connected && address) {
      try {
        // Update balance in Supabase
        const newBalance = await updateFiptBalance(address, amount, true);
        setBalance(newBalance);
      } catch (error) {
        console.error("Error updating balance in Supabase:", error);
        // Update local state as fallback
        setBalance(prev => prev + amount);
      }
    } else {
      // Update local storage for non-connected users
      const newBalance = balance + amount;
      setBalance(newBalance);
      localStorage.setItem('fiptBalance', newBalance.toString());
    }
  };

  const toggleFeedType = (showWebcams: boolean) => {
    setShowWebcams(showWebcams);
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <FeedHeader balance={balance} isLoading={isBalanceLoading} />
      
      {/* Feed Type Tabs */}
      <FeedTabs 
        showWebcams={showWebcams} 
        onToggleWebcams={toggleFeedType} 
      />
      
      {showWebcams ? (
        <TikTokScrollFeed />
      ) : (
        <VerticalFeed 
          feedData={feedData}
          balance={balance}
          onBalanceChange={updateBalance}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default FeedPage;
