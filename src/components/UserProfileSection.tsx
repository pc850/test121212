
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { useToast } from "@/hooks/use-toast";
import { TelegramUser } from "@/types/telegram";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, LogOut, RefreshCw } from "lucide-react";

interface UserProfileSectionProps {
  onLogout: () => void;
}

const UserProfileSection = ({ onLogout }: UserProfileSectionProps) => {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { connected, address, connectWallet, disconnectWallet } = useTonkeeperWallet();
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
          setBalance(balanceData.fipt_balance);
        } else {
          // Get balance from localStorage as fallback
          const savedBalance = localStorage.getItem('fiptBalance');
          if (savedBalance) {
            const parsedBalance = parseInt(savedBalance, 10);
            setBalance(parsedBalance);
            
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
  }, [telegramUser, connected, address, toast]);
  
  // Update Supabase when local balance changes
  useEffect(() => {
    const savedBalance = localStorage.getItem('fiptBalance');
    const parsedBalance = savedBalance ? parseInt(savedBalance, 10) : 0;
    
    // If balance in localStorage is different from state and we have a telegram user
    if (parsedBalance !== balance && telegramUser && (connected || telegramUser)) {
      const updateBalanceInSupabase = async () => {
        try {
          if (connected && address) {
            // Update by wallet address
            await supabase
              .from('wallet_balances')
              .upsert({
                wallet_address: address,
                telegram_id: telegramUser.id,
                fipt_balance: parsedBalance
              });
          } else {
            // Check if there's a default wallet address for this user
            const { data: walletLinks } = await supabase
              .from('user_wallet_links')
              .select('wallet_address')
              .eq('telegram_id', telegramUser.id)
              .eq('is_primary', true)
              .limit(1);
              
            const defaultWalletAddress = walletLinks && walletLinks.length > 0 
              ? walletLinks[0].wallet_address 
              : 'telegram-user-' + telegramUser.id; // Fallback wallet address
            
            // First check if we have an entry for this telegram user
            const { data } = await supabase
              .from('wallet_balances')
              .select('id')
              .eq('telegram_id', telegramUser.id)
              .limit(1);
              
            if (data && data.length > 0) {
              // Update existing entry
              await supabase
                .from('wallet_balances')
                .update({ fipt_balance: parsedBalance })
                .eq('telegram_id', telegramUser.id);
            } else {
              // Create a new entry with the fallback wallet address
              await supabase
                .from('wallet_balances')
                .insert({
                  telegram_id: telegramUser.id,
                  fipt_balance: parsedBalance,
                  wallet_address: defaultWalletAddress
                });
            }
          }
          
          setBalance(parsedBalance);
        } catch (err) {
          console.error('Error updating balance in Supabase:', err);
        }
      };
      
      updateBalanceInSupabase();
    }
  }, [balance, telegramUser, connected, address]);

  const handleLogout = () => {
    localStorage.removeItem('telegramUser');
    setTelegramUser(null);
    if (connected) {
      disconnectWallet();
    }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 border-2 border-fipt-blue">
            {telegramUser.photo_url ? (
              <AvatarImage src={telegramUser.photo_url} alt={telegramUser.first_name} />
            ) : (
              <AvatarFallback>{telegramUser.first_name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h3 className="font-medium text-fipt-dark">
              {telegramUser.first_name} {telegramUser.last_name || ''}
            </h3>
            {telegramUser.username && (
              <p className="text-xs text-fipt-muted">@{telegramUser.username}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={refreshBalance}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            <span className="text-xs">Refresh</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-fipt-muted">FIPT Balance</p>
          <p className="text-xl font-bold text-fipt-dark">{balance} FIPT</p>
        </div>
        
        <div>
          {connected ? (
            <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
              <Wallet className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[120px]">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={connectWallet}
              className="text-xs"
            >
              <Wallet className="h-3 w-3 mr-1" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserProfileSection;
