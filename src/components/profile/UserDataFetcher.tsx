
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
    // Initialize with a mock balance and points for non-authenticated users
    const mockBalance = Math.floor(Math.random() * 10000);
    const mockPoints = Math.floor(Math.random() * 5000);
    localStorage.setItem('testBalance', mockBalance.toString());
    localStorage.setItem('testPoints', mockPoints.toString());
    onBalanceUpdate(mockBalance);
    onPointsUpdate(mockPoints);
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (telegramUser) {
          // Get the balance for the Telegram user
          const { data, error } = await supabase
            .from('wallet_balances')
            .select('fipt_balance, points')
            .eq('telegram_id', telegramUser.id)
            .limit(1);
            
          if (data && data.length > 0 && !error) {
            const userBalance = data[0];
            localStorage.setItem('testBalance', userBalance.fipt_balance.toString());
            localStorage.setItem('testPoints', (userBalance.points || 0).toString());
            onBalanceUpdate(userBalance.fipt_balance);
            onPointsUpdate(userBalance.points || 0);
          }
        } else if (supabaseUser && supabaseUser.id) {
          // Access the id directly from the typed supabaseUser object
          const userId = supabaseUser.id;
          
          if (userId) {
            // Get the balance for the Supabase user
            const { data, error } = await supabase
              .from('wallet_balances')
              .select('fipt_balance, points')
              .eq('user_id', userId)
              .limit(1);
              
            if (data && data.length > 0 && !error) {
              const userBalance = data[0];
              localStorage.setItem('testBalance', userBalance.fipt_balance.toString());
              localStorage.setItem('testPoints', (userBalance.points || 0).toString());
              onBalanceUpdate(userBalance.fipt_balance);
              onPointsUpdate(userBalance.points || 0);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch data from Supabase if the user is authenticated
    if (telegramUser || supabaseUser) {
      fetchUserData();
    }
  }, [telegramUser, supabaseUser, onBalanceUpdate, onPointsUpdate]);
  
  return <>{children}</>;
};

export default UserDataFetcher;
