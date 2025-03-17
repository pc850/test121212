import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TelegramUser } from "@/types/telegram";
import { 
  verifyTelegramLogin, 
  saveUserToSupabase, 
  getUserFromLocalStorage,
  removeUserFromLocalStorage
} from "@/utils/telegramAuthUtils";
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp";

export const useTelegramAuth = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<TelegramUser | null>(null);
  const { toast } = useToast();
  const { detectWebApp } = useTelegramWebApp();
  
  const autoLogin = useCallback(async (): Promise<TelegramUser | null> => {
    try {
      // First try to detect if we're in a Telegram WebApp
      const webAppUser = await detectWebApp();
      if (webAppUser) {
        setCurrentUser(webAppUser);
        setIsLoggedIn(true);
        return webAppUser;
      }
      
      // Otherwise check if user is already stored in localStorage
      const storedUser = getUserFromLocalStorage();
      if (storedUser) {
        setCurrentUser(storedUser);
        setIsLoggedIn(true);
        return storedUser;
      }
      
      return null;
    } catch (error) {
      console.error('Auto login error:', error);
      return null;
    }
  }, [detectWebApp]);
  
  // Run auto login on component mount
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);
  
  const logout = () => {
    removeUserFromLocalStorage();
    setCurrentUser(null);
    setIsLoggedIn(false);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.'
    });
  };
  
  return {
    isVerifying,
    verifyTelegramLogin,
    saveUserToSupabase,
    autoLogin,
    logout,
    isLoggedIn,
    currentUser
  };
};

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
        expand: () => void;
        ready: () => void;
        [key: string]: any;
      };
    };
  }
}
