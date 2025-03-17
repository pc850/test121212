
import { useRef, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { TelegramUser } from "@/types/telegram";

export interface UseTelegramLoginOptions {
  onAuth: (user: TelegramUser) => void;
}

export const useTelegramLogin = ({ onAuth }: UseTelegramLoginOptions) => {
  const { toast } = useToast();
  const { connected, address } = useTonkeeperWallet();
  const scriptLoaded = useRef(false);
  const telegramBtnRef = useRef<HTMLDivElement>(null);

  const handleTelegramAuth = useCallback(async (user: TelegramUser) => {
    console.log('Telegram auth successful:', user);
    
    try {
      // First, store the Telegram user data
      const { error: telegramError } = await supabase
        .from('telegram_users')
        .upsert(
          {
            telegram_id: user.id,
            telegram_username: user.username,
            telegram_first_name: user.first_name,
            telegram_last_name: user.last_name,
            telegram_photo_url: user.photo_url,
            auth_date: user.auth_date,
            hash: user.hash
          },
          { onConflict: 'telegram_id' }
        );
        
      if (telegramError) {
        throw telegramError;
      }

      // If a wallet is connected, link it to the Telegram user
      if (connected && address) {
        console.log('Linking wallet to Telegram user:', address);
        
        // Add the wallet address to user_wallet_links
        const { error: linkError } = await supabase
          .from('user_wallet_links')
          .upsert(
            {
              telegram_id: user.id,
              wallet_address: address,
              is_primary: true
            },
            { 
              onConflict: 'telegram_id, wallet_address',
              ignoreDuplicates: false
            }
          );
          
        if (linkError) {
          console.error('Error linking wallet:', linkError);
          toast({
            title: 'Wallet Linking Error',
            description: 'Could not link your wallet to your Telegram account.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Wallet Linked',
            description: 'Your wallet has been linked to your Telegram account.',
          });
        }
      }
      
      // Update wallet_balances if needed with the Telegram ID
      if (connected && address) {
        await supabase
          .from('wallet_balances')
          .upsert(
            {
              wallet_address: address,
              telegram_id: user.id,
              fipt_balance: 0 // Will be updated by the application logic
            },
            { onConflict: 'wallet_address' }
          );
      }
      
      // Call the provided onAuth callback
      onAuth(user);
      
      toast({
        title: 'Login Successful',
        description: `Welcome, ${user.first_name}!`,
      });
    } catch (error) {
      console.error('Error storing Telegram user:', error);
      toast({
        title: 'Login Failed',
        description: 'There was an error processing your Telegram login.',
        variant: 'destructive'
      });
    }
  }, [connected, address, toast, onAuth]);

  // Listen for auto-login events from the Telegram WebApp
  useEffect(() => {
    const handleAutoLogin = (event: CustomEvent<{user: TelegramUser}>) => {
      if (event.detail?.user) {
        console.log('Received auto-login event with user:', event.detail.user);
        handleTelegramAuth(event.detail.user);
      }
    };

    window.addEventListener('telegramUserAutoLogin', handleAutoLogin as EventListener);
    
    return () => {
      window.removeEventListener('telegramUserAutoLogin', handleAutoLogin as EventListener);
    };
  }, [handleTelegramAuth]);

  // Setup for the Telegram login button
  useEffect(() => {
    // Check if we already have a user in localStorage (auto-login)
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Found stored user, auto-authenticating:', user);
        handleTelegramAuth(user);
        return; // Skip loading the widget if we already have a user
      } catch (e) {
        console.error('Failed to parse stored user, continuing with widget load:', e);
      }
    }
    
    return () => {
      // Cleanup handled in the TelegramLoginButtonUI component
    };
  }, [handleTelegramAuth]);

  return {
    telegramBtnRef,
    scriptLoaded,
    handleTelegramAuth
  };
};
