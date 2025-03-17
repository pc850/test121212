
import { useEffect, useState } from "react";
import EarnButton from "@/components/EarnButton";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import { TelegramUser } from "@/types/telegram";
import UserProfileSection from "@/components/UserProfileSection";
import { useToast } from "@/hooks/use-toast";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

const EarnPage = () => {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('fiptBalance');
    return savedBalance ? parseInt(savedBalance, 10) : 0;
  });
  const { toast } = useToast();
  const { autoLogin, currentUser: telegramUser, isLoggedIn, logout } = useTelegramAuth();
  
  useEffect(() => {
    document.title = "FIPT - Earn";
    
    if (!telegramUser) {
      autoLogin().then(user => {
        if (user) {
          toast({
            title: 'Login Successful',
            description: `Welcome, ${user.first_name}!`,
          });
        }
      });
    }
  }, [toast, autoLogin, telegramUser]);

  useEffect(() => {
    localStorage.setItem('fiptBalance', balance.toString());
    
    if (telegramUser) {
      const updateBalanceInSupabase = async () => {
        try {
          const { data: walletLinks } = await supabase
            .from('user_wallet_links')
            .select('wallet_address')
            .eq('telegram_id', telegramUser.id)
            .eq('is_primary', true)
            .limit(1);
            
          const defaultWalletAddress = walletLinks && walletLinks.length > 0 
            ? walletLinks[0].wallet_address 
            : 'telegram-user-' + telegramUser.id;
          
          const { data } = await supabase
            .from('wallet_balances')
            .select('id')
            .eq('telegram_id', telegramUser.id)
            .limit(1);
            
          if (data && data.length > 0) {
            await supabase
              .from('wallet_balances')
              .update({ fipt_balance: balance })
              .eq('telegram_id', telegramUser.id);
          } else {
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

  const handleEarnPoints = (points: number) => {
    setBalance(prev => prev + points);
  };
  
  const handleTelegramAuth = (user: TelegramUser) => {
    localStorage.setItem('telegramUser', JSON.stringify(user));
    autoLogin();
  };

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 animate-fade-in">
      {telegramUser ? (
        <UserProfileSection onLogout={logout} />
      ) : (
        <div className="mb-6 flex justify-center">
          <Card className="p-4 border border-fipt-blue/20 bg-white">
            <h3 className="text-sm font-medium text-fipt-dark mb-3 text-center">Login to Save Your Progress</h3>
            <TelegramLoginButton 
              botName="Chicktok_bot"
              buttonSize="medium"
              onAuth={handleTelegramAuth}
              className="flex justify-center"
            />
          </Card>
        </div>
      )}
      
      {!telegramUser && (
        <div className="mb-6">
          <Card className="w-full p-4 border border-fipt-blue/20 bg-gradient-to-r from-fipt-blue/10 to-fipt-accent/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-fipt-muted">Your Balance</h2>
                <div className="flex items-center mt-1">
                  <Coins className="w-5 h-5 mr-2 text-fipt-blue" />
                  <span className="text-2xl font-bold text-fipt-dark">{balance.toLocaleString()}</span>
                  <span className="ml-1 text-xs font-medium text-fipt-blue">FIPT</span>
                </div>
              </div>
              <div className="bg-white/80 px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs font-medium text-fipt-dark">Rank #42</span>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      <div className="mb-8 text-center">
        <div className="inline-block px-3 py-1 bg-fipt-blue/10 rounded-full text-xs font-medium text-fipt-blue mb-2">
          Click to Earn
        </div>
        <h1 className="text-2xl font-bold text-fipt-dark">Earn FIPT Points</h1>
        <p className="text-sm text-fipt-muted mt-1">
          Tap the button below to earn FIPT points
        </p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <EarnButton onEarn={handleEarnPoints} />
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-fipt-muted mb-1">Today's Earnings</h3>
          <p className="text-xl font-bold text-fipt-dark">{balance} FIPT</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-fipt-muted mb-1">Rank</h3>
          <p className="text-xl font-bold text-fipt-dark">#42</p>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;
