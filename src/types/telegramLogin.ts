
import { TelegramUser } from "./telegram";

// Define Telegram login button props interface
export interface TelegramLoginButtonProps {
  botName?: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: 'write';
  usePic?: boolean;
  lang?: string;
  widgetVersion?: number;
  onAuth: (user: TelegramUser) => void;
  className?: string;
}

// Define Telegram login widget global interface
export interface TelegramLoginWidget {
  dataOnauth: (user: TelegramUser) => void;
}

declare global {
  interface Window {
    TelegramLoginWidget: TelegramLoginWidget;
  }
}
