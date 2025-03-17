
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TelegramUser } from "@/types/telegram";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";

interface UserDataFetcherProps {
  telegramUser: TelegramUser | null;
  onBalanceUpdate: (balance: number) => void;
  children: React.ReactNode;
}

const UserDataFetcher = ({ telegramUser, onBalanceUpdate, children }: UserDataFetcherProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { connected, address } = useTonkeeperWallet();
  const { toast } = useToast();

  // Fetch user balance when telegram user or wallet address changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!telegramUser) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Try to get balance from telegram_id first
        let { data: balanceData, error } = await supabase
          .from('wallet_balances')
          .select('fipt_balance')
          .eq('telegram_id', telegramUser.id)
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();
        
        // If no balance found by telegram_id and wallet is connected, try by wallet_address
        if ((!balanceData || error) && connected && address) {
          const { data: walletBalanceData, error: walletError } = await supabase
            .from('wallet_balances')
            .select('fipt_balance')
            .eq('wallet_address', address)
            .single();
            
          if (!walletError && walletBalanceData) {
            balanceData = walletBalanceData;
            
            // Update the wallet_balances entry with telegram_id for future queries
            await supabase
              .from('wallet_balances')
              .update({ telegram_id: telegramUser.id })
              .eq('wallet_address', address);
          }
        }
        
        if (balanceData) {
          onBalanceUpdate(balanceData.fipt_balance);
        } else {
          // Get balance from localStorage as fallback
          const savedBalance = localStorage.getItem('fiptBalance');
          if (savedBalance) {
            const parsedBalance = parseInt(savedBalance, 10);
            onBalanceUpdate(parsedBalance);
            
            // Store this balance in Supabase if we have a wallet address
            if (connected && address) {
              await supabase
                .from('wallet_balances')
                .upsert({
                  wallet_address: address,
                  telegram_id: telegramUser.id,
                  fipt_balance: parsedBalance
                });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast({
          title: 'Data Fetch Error',
          description: 'Could not retrieve your balance information.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [telegramUser, connected, address, toast, onBalanceUpdate]);

  if (isLoading) {
    return <div className="p-4 animate-pulse bg-gray-100 rounded-xl">Loading user data...</div>;
  }

  return <>{children}</>;
};

export default UserDataFetcher;
