
import { Search } from "lucide-react";
import TonConnectButton from "@/components/TonConnectButton";
import { useState, useEffect } from "react";
import { TelegramUser } from "@/types/telegram";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

interface FeedHeaderProps {
  balance: number;
}

const FeedHeader = ({ balance }: FeedHeaderProps) => {
  const { currentUser: telegramUser, autoLogin } = useTelegramAuth();
  const [isTelegramMobileApp, setIsTelegramMobileApp] = useState(false);
  
  useEffect(() => {
    // Check if running in Telegram mobile app
    const telegramMobileAppFlag = localStorage.getItem('isTelegramMobileApp');
    setIsTelegramMobileApp(telegramMobileAppFlag === 'true');
    
    // If no user is in state, try to auto-login
    if (!telegramUser) {
      autoLogin();
    }
  }, [telegramUser, autoLogin]);
  
  useEffect(() => {
    // If user is logged in with Telegram, update balance in Supabase
    if (telegramUser) {
      const updateBalanceInSupabase = async () => {
        try {
          // Look for a default wallet address for this user
          const { data: walletLinks } = await supabase
            .from('user_wallet_links')
            .select('wallet_address')
            .eq('telegram_id', telegramUser.id)
            .eq('is_primary', true)
            .limit(1);
            
          const defaultWalletAddress = walletLinks && walletLinks.length > 0 
            ? walletLinks[0].wallet_address 
            : 'telegram-user-' + telegramUser.id; // Fallback wallet address
          
          // First check if this telegram user has a balance record
          const { data } = await supabase
            .from('wallet_balances')
            .select('id')
            .eq('telegram_id', telegramUser.id)
            .limit(1);
            
          if (data && data.length > 0) {
            // Update existing balance
            await supabase
              .from('wallet_balances')
              .update({ fipt_balance: balance })
              .eq('telegram_id', telegramUser.id);
          } else {
            // Insert new balance record with the fallback wallet address
            await supabase
              .from('wallet_balances')
              .insert({
                telegram_id: telegramUser.id,
                fipt_balance: balance,
                wallet_address: defaultWalletAddress
              });
          }
        } catch (err) {
          console.error('Error updating balance in Supabase:', err);
        }
      };
      
      updateBalanceInSupabase();
    }
  }, [balance, telegramUser]);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 py-3 px-4 flex items-center justify-between glass">
      <h1 className="text-xl font-bold text-fipt-dark">TEST Feed</h1>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full bg-fipt-blue/10 text-sm font-medium text-fipt-blue">
          {balance} TEST
        </span>
        
        {telegramUser ? (
          <Avatar className="h-8 w-8 border border-white">
            {telegramUser.photo_url ? (
              <AvatarImage src={telegramUser.photo_url} alt={telegramUser.first_name} />
            ) : (
              <AvatarFallback>{telegramUser.first_name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
        ) : (
          <TonConnectButton />
        )}
        
        <div className="relative">
          <input 
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-2 w-32 rounded-full text-sm text-fipt-dark bg-fipt-gray border-none focus:outline-none focus:ring-2 focus:ring-fipt-blue"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fipt-muted" />
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
