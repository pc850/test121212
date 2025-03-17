
import { useEffect, useState } from "react";
import EarnButton from "@/components/EarnButton";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TelegramLoginButton, { TelegramUser } from "@/components/TelegramLoginButton";
import UserProfileSection from "@/components/UserProfileSection";
import { useToast } from "@/hooks/use-toast";

const EarnPage = () => {
  const [balance, setBalance] = useState(() => {
    // Initialize balance from localStorage, or 0 if not found
    const savedBalance = localStorage.getItem('fiptBalance');
    return savedBalance ? parseInt(savedBalance, 10) : 0;
  });
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Set page title
    document.title = "FIPT - Earn";
    
    // Check if user is already logged in with Telegram
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

  useEffect(() => {
    // Save balance to localStorage whenever it changes
    localStorage.setItem('fiptBalance', balance.toString());
    
    // If user is logged in with Telegram, update balance in Supabase
    if (telegramUser) {
      const updateBalanceInSupabase = async () => {
        try {
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
            // Insert new balance record
            await supabase
              .from('wallet_balances')
              .insert({
                telegram_id: telegramUser.id,
                fipt_balance: balance
              });
          }
        } catch (err) {
          console.error('Error updating balance in Supabase:', err);
        }
      };
      
      updateBalanceInSupabase();
    }
  }, [balance, telegramUser]);

  // Function to increase balance with each button tap
  const handleEarnPoints = (points: number) => {
    setBalance(prev => prev + points);
  };
  
  // Handle Telegram login
  const handleTelegramAuth = (user: TelegramUser) => {
    setTelegramUser(user);
    localStorage.setItem('telegramUser', JSON.stringify(user));
  };
  
  // Handle logout
  const handleLogout = () => {
    setTelegramUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 animate-fade-in">
      {/* User Profile Section (if logged in) */}
      {telegramUser ? (
        <UserProfileSection onLogout={handleLogout} />
      ) : (
        <div className="mb-6 flex justify-center">
          <Card className="p-4 border border-fipt-blue/20 bg-white">
            <h3 className="text-sm font-medium text-fipt-dark mb-3 text-center">Login to Save Your Progress</h3>
            <TelegramLoginButton 
              botName="fipt_demo_bot" // Replace with your Telegram bot name
              buttonSize="medium"
              onAuth={handleTelegramAuth}
              className="flex justify-center"
            />
          </Card>
        </div>
      )}
      
      {/* FIPT Balance Section */}
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
      
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block px-3 py-1 bg-fipt-blue/10 rounded-full text-xs font-medium text-fipt-blue mb-2">
          Click to Earn
        </div>
        <h1 className="text-2xl font-bold text-fipt-dark">Earn FIPT Points</h1>
        <p className="text-sm text-fipt-muted mt-1">
          Tap the button below to earn FIPT points
        </p>
      </div>
      
      {/* Earn Button */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <EarnButton onEarn={handleEarnPoints} />
      </div>
      
      {/* Stats */}
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
