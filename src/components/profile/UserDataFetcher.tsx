
import { useEffect, useState, ReactNode } from 'react';
import { TelegramUser } from "@/types/telegram";
import { supabase } from "@/integrations/supabase/client";

interface UserDataFetcherProps {
  children: ReactNode;
  telegramUser: TelegramUser | null;
  supabaseUser?: any; // Using any for Supabase user to avoid deep type recursion
  onBalanceUpdate: (balance: number) => void;
}

const UserDataFetcher = ({ 
  children, 
  telegramUser, 
  supabaseUser,
  onBalanceUpdate 
}: UserDataFetcherProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize with a mock balance
    const mockBalance = Math.floor(Math.random() * 10000);
    localStorage.setItem('fiptBalance', mockBalance.toString());
    onBalanceUpdate(mockBalance);
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (telegramUser) {
          // Get the balance for the Telegram user
          const { data, error } = await supabase
            .from('wallet_balances')
            .select('fipt_balance')
            .eq('telegram_id', telegramUser.id)
            .single();
            
          if (data) {
            localStorage.setItem('fiptBalance', data.fipt_balance.toString());
            onBalanceUpdate(data.fipt_balance);
          }
        } else if (supabaseUser) {
          // Extract user ID safely as a string to avoid type recursion issues
          const userId = supabaseUser?.id ? String(supabaseUser.id) : null;
          
          if (userId) {
            // Get the balance for the Supabase user
            const { data, error } = await supabase
              .from('wallet_balances')
              .select('fipt_balance')
              .eq('user_id', userId)
              .single();
              
            if (data) {
              localStorage.setItem('fiptBalance', data.fipt_balance.toString());
              onBalanceUpdate(data.fipt_balance);
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
  }, [telegramUser, supabaseUser, onBalanceUpdate]);
  
  return <>{children}</>;
};

export default UserDataFetcher;
