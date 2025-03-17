
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";

// Define Telegram user interface
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: 'write';
  usePic?: boolean;
  lang?: string;
  widgetVersion?: number;
  onAuth: (user: TelegramUser) => void;
  className?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

const TelegramLoginButton = ({
  botName = 'fipt_bot', // Update this to use your bot name
  buttonSize = 'medium',
  cornerRadius = 8,
  requestAccess,
  usePic = true,
  lang = 'en',
  widgetVersion = 19,
  onAuth,
  className = ''
}: TelegramLoginButtonProps) => {
  const { toast } = useToast();
  const { connected, address, wallet } = useTonkeeperWallet();
  const scriptLoaded = useRef(false);
  const telegramBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure script is loaded only once
    if (scriptLoaded.current) return;
    
    // Define callback function for Telegram widget
    window.TelegramLoginWidget = {
      dataOnauth: async (user: TelegramUser) => {
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
      }
    };

    // Create and load the Telegram script
    const script = document.createElement('script');
    script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`;
    script.async = true;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.setAttribute('data-request-access', 'write');
    
    if (usePic) {
      script.setAttribute('data-userpic', 'true');
    }
    
    if (lang) {
      script.setAttribute('data-lang', lang);
    }
    
    // Add script to the button container
    if (telegramBtnRef.current) {
      telegramBtnRef.current.appendChild(script);
      scriptLoaded.current = true;
    }

    return () => {
      // Clean up script when component unmounts
      if (telegramBtnRef.current && script.parentNode) {
        telegramBtnRef.current.removeChild(script);
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, usePic, lang, widgetVersion, onAuth, connected, address, toast]);

  return <div ref={telegramBtnRef} className={className}></div>;
};

export default TelegramLoginButton;
