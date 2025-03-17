
import { useState, useEffect } from 'react';
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TelegramUser } from "@/types/telegram";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";

interface UserBalanceProps {
  balance: number;
  telegramUser: TelegramUser | null;
}

const UserBalance = ({ balance, telegramUser }: UserBalanceProps) => {
  const { connected, address, connectWallet } = useTonkeeperWallet();
  
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
        } catch (err) {
          console.error('Error updating balance in Supabase:', err);
        }
      };
      
      updateBalanceInSupabase();
    }
  }, [balance, telegramUser, connected, address]);

  return (
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
  );
};

export default UserBalance;
