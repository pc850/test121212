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
import { supabase } from "@/integrations/supabase/client";

export const useTelegramAuth = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<TelegramUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const { toast } = useToast();
  const { detectWebApp } = useTelegramWebApp();
  
  // Listen for Supabase auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setSupabaseUser(session.user);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setSupabaseUser(null);
        if (!currentUser) {
          setIsLoggedIn(false);
        }
      }
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setIsLoggedIn(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [currentUser]);
  
  const autoLogin = useCallback(async (): Promise<TelegramUser | null> => {
    try {
      setIsVerifying(true);
      
      // First check if we have a Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSupabaseUser(session.user);
        setIsLoggedIn(true);
        return null;
      }
      
      // Then try to detect if we're in a Telegram WebApp
      try {
        const webAppUser = await detectWebApp();
        if (webAppUser) {
          setCurrentUser(webAppUser);
          setIsLoggedIn(true);
          return webAppUser;
        }
      } catch (error) {
        console.error('Failed to detect WebApp:', error);
      }
      
      // Otherwise check if user is already stored in localStorage
      const storedUser = getUserFromLocalStorage();
      if (storedUser) {
        try {
          // Verify the stored user
          const isValid = await verifyTelegramLogin(storedUser);
          if (isValid) {
            setCurrentUser(storedUser);
            setIsLoggedIn(true);
            return storedUser;
          } else {
            // Remove invalid stored user
            removeUserFromLocalStorage();
          }
        } catch (error) {
          console.error('Failed to verify stored user:', error);
          removeUserFromLocalStorage();
        }
      }
      
      return null;
    } catch (error) {
      console.error('Auto login error:', error);
      return null;
    } finally {
      setIsVerifying(false);
    }
  }, [detectWebApp]);
  
  // Run auto login on component mount
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);
  
  const logout = async () => {
    // Sign out from Supabase if logged in
    if (supabaseUser) {
      await supabase.auth.signOut();
      setSupabaseUser(null);
    }
    
    // Remove Telegram user if logged in
    if (currentUser) {
      removeUserFromLocalStorage();
      setCurrentUser(null);
    }
    
    setIsLoggedIn(false);
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.'
    });
  };
  
  // Get the display name from either source
  const getDisplayName = useCallback(() => {
    if (currentUser?.username) {
      return currentUser.username;
    } else if (currentUser?.first_name) {
      return currentUser.first_name;
    } else if (supabaseUser?.email) {
      return supabaseUser.email.split('@')[0];
    } else if (supabaseUser?.user_metadata?.full_name) {
      return supabaseUser.user_metadata.full_name;
    }
    return "User";
  }, [currentUser, supabaseUser]);
  
  return {
    isVerifying,
    verifyTelegramLogin,
    saveUserToSupabase,
    autoLogin,
    logout,
    isLoggedIn,
    currentUser,
    supabaseUser,
    getDisplayName
  };
};
