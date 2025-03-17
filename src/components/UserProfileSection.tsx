
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { TelegramUser } from "@/types/telegram";
import { Card } from "@/components/ui/card";
import UserHeader from "@/components/profile/UserHeader";
import UserBalance from "@/components/profile/UserBalance";
import UserDataFetcher from "@/components/profile/UserDataFetcher";

interface UserProfileSectionProps {
  onLogout: () => void;
}

const UserProfileSection = ({ onLogout }: UserProfileSectionProps) => {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const { disconnectWallet } = useTonkeeperWallet();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in with Telegram
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      try {
        setTelegramUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('telegramUser');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('telegramUser');
    setTelegramUser(null);
    disconnectWallet();
    onLogout();
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };
  
  const refreshBalance = async () => {
    const savedBalance = localStorage.getItem('fiptBalance');
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
      
      toast({
        title: 'Balance Refreshed',
        description: 'Your FIPT balance has been updated.',
      });
    }
  };
  
  // If not logged in with Telegram, don't show this component
  if (!telegramUser) return null;

  return (
    <Card className="p-4 mb-4 bg-white shadow-sm border border-gray-100 rounded-xl">
      <UserDataFetcher 
        telegramUser={telegramUser}
        onBalanceUpdate={setBalance}
      >
        <UserHeader
          telegramUser={telegramUser}
          onLogout={handleLogout}
          onRefresh={refreshBalance}
        />
        
        <UserBalance 
          balance={balance}
          telegramUser={telegramUser}
        />
      </UserDataFetcher>
    </Card>
  );
};

export default UserProfileSection;
