
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { Card } from "@/components/ui/card";
import UserHeader from "@/components/profile/UserHeader";
import UserBalance from "@/components/profile/UserBalance";
import UserDataFetcher from "@/components/profile/UserDataFetcher";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

interface UserProfileSectionProps {
  onLogout: () => void;
}

const UserProfileSection = ({ onLogout }: UserProfileSectionProps) => {
  const { currentUser, supabaseUser } = useTelegramAuth();
  const [balance, setBalance] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const { disconnectWallet } = useTonkeeperWallet();
  const { toast } = useToast();

  const handleLogout = () => {
    disconnectWallet();
    onLogout();
  };
  
  const refreshBalance = async () => {
    const savedBalance = localStorage.getItem('fiptBalance');
    const savedPoints = localStorage.getItem('fiptPoints');
    
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
    }
    
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
    
    toast({
      title: 'Balance Refreshed',
      description: 'Your FIPT balance and points have been updated.',
    });
  };
  
  // If not logged in, don't show this component
  if (!currentUser && !supabaseUser) return null;

  return (
    <Card className="p-5 mb-4 bg-white shadow-md border border-gray-100 rounded-xl w-full hover:shadow-lg transition-shadow duration-300">
      <UserDataFetcher 
        telegramUser={currentUser}
        supabaseUser={supabaseUser}
        onBalanceUpdate={setBalance}
        onPointsUpdate={setPoints}
      >
        <UserHeader
          telegramUser={currentUser}
          supabaseUser={supabaseUser}
          onLogout={handleLogout}
          onRefresh={refreshBalance}
        />
        
        <UserBalance 
          balance={balance}
          points={points}
          telegramUser={currentUser}
          supabaseUser={supabaseUser}
        />
      </UserDataFetcher>
    </Card>
  );
};

export default UserProfileSection;
