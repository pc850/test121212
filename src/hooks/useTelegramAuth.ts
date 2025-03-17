
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TelegramUser } from '@/components/TelegramLoginButton';

export const useTelegramAuth = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  
  const verifyTelegramLogin = async (user: TelegramUser): Promise<boolean> => {
    setIsVerifying(true);
    
    try {
      // Call the verify-telegram-login function
      const { data, error } = await supabase.functions.invoke('verify-telegram-login', {
        body: { telegramData: user }
      });
      
      if (error) {
        console.error('Error verifying Telegram login:', error);
        return false;
      }
      
      return data.valid === true;
    } catch (err) {
      console.error('Failed to verify Telegram login:', err);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };
  
  const saveUserToSupabase = async (user: TelegramUser): Promise<boolean> => {
    try {
      // Store the user data in the telegram_users table
      const { error } = await supabase
        .from('telegram_users')
        .upsert({
          telegram_id: user.id,
          telegram_username: user.username,
          telegram_first_name: user.first_name,
          telegram_last_name: user.last_name,
          telegram_photo_url: user.photo_url,
          auth_date: user.auth_date,
          hash: user.hash
        }, { onConflict: 'telegram_id' });
        
      if (error) {
        console.error('Error saving Telegram user to Supabase:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Failed to save Telegram user to Supabase:', err);
      return false;
    }
  };
  
  // New function to extract WebApp Telegram user data from the mini-app
  const autoLogin = useCallback(async (): Promise<TelegramUser | null> => {
    try {
      // Check if running in Telegram WebApp
      if (window.Telegram && window.Telegram.WebApp) {
        console.log('Running in Telegram WebApp, attempting auto-login');
        
        const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (webAppUser) {
          console.log('Got WebApp user data:', webAppUser);
          
          // Create a TelegramUser object from the WebApp data
          const telegramUser: TelegramUser = {
            id: webAppUser.id,
            first_name: webAppUser.first_name,
            last_name: webAppUser.last_name || undefined,
            username: webAppUser.username || undefined,
            photo_url: webAppUser.photo_url || undefined,
            auth_date: Math.floor(Date.now() / 1000), // Current timestamp
            hash: window.Telegram.WebApp.initData // Use initData as hash for reference
          };
          
          // Save the user to Supabase
          await saveUserToSupabase(telegramUser);
          
          // Store the user in localStorage
          localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
          
          return telegramUser;
        }
      } else {
        console.log('Not running in Telegram WebApp');
      }
      
      // Try to get WebApp data from URL params (for browser testing)
      const urlParams = new URLSearchParams(window.location.search);
      const telegramData = urlParams.get('tgWebAppData');
      
      if (telegramData) {
        try {
          const decodedData = JSON.parse(decodeURIComponent(telegramData));
          if (decodedData.user) {
            const user = decodedData.user;
            const telegramUser: TelegramUser = {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name || undefined,
              username: user.username || undefined,
              photo_url: user.photo_url || undefined,
              auth_date: Math.floor(Date.now() / 1000),
              hash: telegramData
            };
            
            await saveUserToSupabase(telegramUser);
            localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
            return telegramUser;
          }
        } catch (e) {
          console.error('Failed to parse tgWebAppData:', e);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Auto login error:', error);
      return null;
    }
  }, []);
  
  return {
    isVerifying,
    verifyTelegramLogin,
    saveUserToSupabase,
    autoLogin
  };
};

// Add TypeScript declaration for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
          [key: string]: any;
        };
        [key: string]: any;
      };
    };
  }
}
