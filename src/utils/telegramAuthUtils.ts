
import { TelegramUser } from "@/types/telegram";
import { supabase } from "@/integrations/supabase/client";

// The Telegram bot username we're using (https://t.me/Chicktok_bot?profile)
const TELEGRAM_BOT_NAME = 'Chicktok_bot';

export const verifyTelegramLogin = async (user: TelegramUser): Promise<boolean> => {
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
  }
};

export const saveUserToSupabase = async (user: TelegramUser): Promise<boolean> => {
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

export const getUserFromLocalStorage = (): TelegramUser | null => {
  const storedUser = localStorage.getItem('telegramUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      localStorage.removeItem('telegramUser');
    }
  }
  return null;
};

export const saveUserToLocalStorage = (user: TelegramUser): void => {
  localStorage.setItem('telegramUser', JSON.stringify(user));
};

export const removeUserFromLocalStorage = (): void => {
  localStorage.removeItem('telegramUser');
};

// Helper function to determine if we're in a particular Telegram bot's Mini App
export const isInTelegramMiniApp = (): boolean => {
  // Check if we're in a WebApp
  const inWebApp = typeof window !== 'undefined' && 
                  window.Telegram && 
                  window.Telegram.WebApp;
  
  if (inWebApp) {
    // If botInfo is available, check if it matches our bot
    if (window.Telegram.WebApp.botInfo && 
        window.Telegram.WebApp.botInfo.username === TELEGRAM_BOT_NAME) {
      return true;
    }
    
    // Otherwise, check based on localStorage flag which might have been set
    return localStorage.getItem('isTelegramMiniApp') === 'true';
  }
  
  return false;
};
