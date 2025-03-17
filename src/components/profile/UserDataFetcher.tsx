
import { useEffect, useState, ReactNode } from 'react';
import { TelegramUser } from "@/types/telegram";
import { supabase } from "@/integrations/supabase/client";

interface UserDataFetcherProps {
  children: ReactNode;
  telegramUser: TelegramUser | null;
  supabaseUser: { id: string } | null;
  onBalanceUpdate: (balance: number) => void;
  onPointsUpdate: (points: number) => void;
}

const UserDataFetcher = ({ 
  children, 
  telegramUser, 
  supabaseUser,
  onBalanceUpdate,
  onPointsUpdate
}: UserDataFetcherProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize with a mock balance and points
    const mockBalance = Math.floor(Math.random() * 10000);
    const mockPoints = Math.floor(Math.random() * 5000);
    localStorage.setItem('fiptBalance', mockBalance.toString());
    localStorage.setItem('fiptPoints', mockPoints.toString());
    onBalanceUpdate(mockBalance);
    onPointsUpdate(mockPoints);
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (telegramUser) {
          // Get the balance for the Telegram user
          const { data } = await supabase
            .from('wallet_balances')
            .select('fipt_balance, points')
            .eq('telegram_id', telegramUser.id)
            .maybeSingle();
            
          if (data) {
            localStorage.setItem('fiptBalance', data.fipt_balance.toString());
            localStorage.setItem('fiptPoints', data.points.toString());
            onBalanceUpdate(data.fipt_balance);
            onPointsUpdate(data.points);
          }
        } else if (supabaseUser && supabaseUser.id) {
          // Access the id directly from the typed supabaseUser object
          const userId = supabaseUser.id;
          
          if (userId) {
            // Get the balance for the Supabase user
            const { data } = await supabase
              .from('wallet_balances')
              .select('fipt_balance, points')
              .eq('user_id', userId)
              .maybeSingle();
              
            if (data) {
              localStorage.setItem('fiptBalance', data.fipt_balance.toString());
              localStorage.setItem('fiptPoints', data.points.toString());
              onBalanceUpdate(data.fipt_balance);
              onPointsUpdate(data.points);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [telegramUser, supabaseUser, onBalanceUpdate, onPointsUpdate]);
  
  return <>{children}</>;
};

export default UserDataFetcher;
