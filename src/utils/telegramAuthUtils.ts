
import { TelegramUser } from "@/types/telegram";
import { supabase } from "@/integrations/supabase/client";

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
