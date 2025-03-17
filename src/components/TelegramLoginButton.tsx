
import React from 'react';
import { TelegramLoginButtonProps } from '@/types/telegramLogin';
import { useTelegramLogin } from '@/hooks/useTelegramLogin';
import TelegramLoginButtonUI from './telegram/TelegramLoginButtonUI';

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = (props) => {
  // Default bot name is Chicktok_bot which is https://t.me/Chicktok_bot?profile
  const { telegramBtnRef, scriptLoaded, handleTelegramAuth } = useTelegramLogin({
    onAuth: props.onAuth
  });

  return (
    <TelegramLoginButtonUI
      {...props}
      botName={props.botName || 'Chicktok_bot'}
      btnRef={telegramBtnRef}
      scriptLoaded={scriptLoaded}
      onAuthCallback={handleTelegramAuth}
    />
  );
};

export default TelegramLoginButton;
