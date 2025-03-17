
import { useEffect, useState, ReactNode } from 'react';
import { TelegramUser } from "@/types/telegram";
import { supabase } from "@/integrations/supabase/client";

interface UserDataFetcherProps {
  children: ReactNode;
  telegramUser: TelegramUser | null;
  supabaseUser: { id: string } | null; // Explicitly define the type to prevent deep instantiation
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
        } else if (supabaseUser && supabaseUser.id) {
          // Access the id directly from the typed supabaseUser object
          const userId = supabaseUser.id;
          
          if (userId) {
            // Get the balance for the Supabase user
            const { data } = await supabase
              .from('wallet_balances')
              .select('fipt_balance')
              .eq('user_id', userId)
              .maybeSingle(); // Use maybeSingle instead of single to prevent errors
              
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
