
/**
 * TypeScript declarations for Telegram WebApp
 */

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramWebAppBotInfo {
  username: string;
  name?: string;
  photo_url?: string;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  auth_date?: number;
  hash?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  ready: () => void;
  expand: () => void;
  close: () => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  MainButton: {
    text: string;
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  botInfo?: TelegramWebAppBotInfo;
}

interface TelegramBridge {
  openTonkeeperWallet: (url: string, options?: { sessionId?: string }) => boolean;
  enhanceTelegramOpenLink: () => void;
  handleTelegramUserLogin: (user: TelegramWebAppUser, initData: string) => void;
  createMockTelegramEnvironment: (tgWebAppData?: string) => void;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
  telegramWebApp?: TelegramWebApp;
  telegramBridge?: TelegramBridge;
}
