
import React, { useEffect, RefObject } from 'react';
import { TelegramLoginButtonProps } from '@/types/telegramLogin';

interface TelegramLoginButtonUIProps extends TelegramLoginButtonProps {
  btnRef: RefObject<HTMLDivElement>;
  scriptLoaded: RefObject<boolean>;
  onAuthCallback: (user: any) => void; 
}

// The UI component just handles rendering the button container and loading the script
const TelegramLoginButtonUI: React.FC<TelegramLoginButtonUIProps> = ({
  botName = 'Chicktok_bot',
  buttonSize = 'medium',
  cornerRadius = 8,
  requestAccess = 'write',
  usePic = true,
  lang = 'en',
  widgetVersion = 19,
  className = '',
  btnRef,
  scriptLoaded,
  onAuthCallback
}) => {
  useEffect(() => {
    // Skip if script is already loaded
    if (scriptLoaded.current) return;
    
    // Define callback function for Telegram widget
    window.TelegramLoginWidget = {
      dataOnauth: onAuthCallback
    };

    // Create and load the Telegram script
    const script = document.createElement('script');
    script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`;
    script.async = true;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.setAttribute('data-request-access', requestAccess);
    
    if (usePic) {
      script.setAttribute('data-userpic', 'true');
    }
    
    if (lang) {
      script.setAttribute('data-lang', lang);
    }
    
    // Add script to the button container
    if (btnRef.current) {
      btnRef.current.appendChild(script);
      // Use a variable instead of directly modifying the read-only property
      const isLoaded = true;
      Object.defineProperty(scriptLoaded, 'current', { 
        get: function() { return isLoaded; }
      });
    }

    return () => {
      // Clean up script when component unmounts
      if (btnRef.current && script.parentNode) {
        btnRef.current.removeChild(script);
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, usePic, lang, widgetVersion, btnRef, scriptLoaded, onAuthCallback]);

  return <div ref={btnRef} className={className}></div>;
};

export default TelegramLoginButtonUI;
