
import React from 'react';
import { TelegramLoginButtonProps } from '@/types/telegramLogin';
import { useTelegramLogin } from '@/hooks/useTelegramLogin';
import TelegramLoginButtonUI from './telegram/TelegramLoginButtonUI';

// Default to Chicktok_bot which is https://t.me/Chicktok_bot
const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = (props) => {
  const { telegramBtnRef, scriptLoaded, handleTelegramAuth } = useTelegramLogin({
    onAuth: props.onAuth
  });

  return (
    <TelegramLoginButtonUI
      {...props}
      btnRef={telegramBtnRef}
      scriptLoaded={scriptLoaded}
      onAuthCallback={handleTelegramAuth}
    />
  );
};

export default TelegramLoginButton;
