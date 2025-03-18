
import { useEffect, useState } from "react";
import TikTokScrollFeed from "@/components/TikTokScrollFeed";
import { useToast } from "@/hooks/use-toast";
import { mockFeedData } from "@/data/mockFeedData";
import FeedHeader from "@/components/feed/FeedHeader";
import FeedTabs from "@/components/feed/FeedTabs";
import VerticalFeed from "@/components/feed/VerticalFeed";

const FeedPage = () => {
  const [feedData, setFeedData] = useState(mockFeedData);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebcams, setShowWebcams] = useState(false);
  const { toast } = useToast();
  
  // Get the user's balance from localStorage
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('testBalance');
    return savedBalance ? parseInt(savedBalance, 10) : 0;
  });

  // Update balance in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('testBalance', balance.toString());
  }, [balance]);

  useEffect(() => {
    // Set page title
    document.title = "TEST - Feed";
  }, []);

  // Function to update the balance (for FeedCard interactions)
  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const toggleFeedType = (showWebcams: boolean) => {
    setShowWebcams(showWebcams);
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <FeedHeader balance={balance} />
      
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
