
import { useCallback } from 'react';
import { TelegramUser } from "@/types/telegram";
import { saveUserToSupabase, saveUserToLocalStorage } from "@/utils/telegramAuthUtils";

export const useTelegramWebApp = () => {
  const detectWebApp = useCallback(async (): Promise<TelegramUser | null> => {
    try {
      console.log("Detecting Telegram WebApp environment...");
      
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
          saveUserToLocalStorage(telegramUser);
          
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
            saveUserToLocalStorage(telegramUser);
            return telegramUser;
          }
        } catch (e) {
          console.error('Failed to parse tgWebAppData:', e);
        }
      }
      
      return null;
    } catch (error) {
      console.error('WebApp detection error:', error);
      return null;
    }
  }, []);

  return { detectWebApp };
};
