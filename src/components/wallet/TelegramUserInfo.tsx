
import React from "react";
import { TelegramUser } from "@/types/telegram";

interface TelegramUserInfoProps {
  telegramUser: TelegramUser | null;
}

const TelegramUserInfo: React.FC<TelegramUserInfoProps> = ({ telegramUser }) => {
  if (!telegramUser) {
    return null;
  }
  
  return (
    <div className="p-2 bg-muted rounded-md text-xs text-muted-foreground">
      <p>Connecting will link your wallet to your Telegram account:</p>
      <p className="font-medium mt-1">@{telegramUser.username || telegramUser.first_name}</p>
    </div>
  );
};

export default TelegramUserInfo;
