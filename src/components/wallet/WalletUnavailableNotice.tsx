
import React from "react";
import { isInTelegramMiniApp } from "@/utils/telegramAuthUtils";

interface WalletUnavailableNoticeProps {
  hasTonkeeper: boolean;
  isConnecting: boolean;
}

const WalletUnavailableNotice: React.FC<WalletUnavailableNoticeProps> = ({ 
  hasTonkeeper,
  isConnecting
}) => {
  if (hasTonkeeper || isConnecting) {
    return null;
  }
  
  // Use the helper function to determine if we're in Telegram Mini App (specifically for Chicktok_bot)
  const isTelegramMiniApp = isInTelegramMiniApp();
  
  return (
    <div className="p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
      <p className="font-medium">Tonkeeper Not Found</p>
      {isTelegramMiniApp ? (
        <p>Tonkeeper wallet is not available in the Telegram Mini App. When you click Connect, you'll be redirected to the Tonkeeper browser version of FIPT with your wallet already connected.</p>
      ) : (
        <p>Tonkeeper wallet is not available. You may need to install the Tonkeeper app or extension first.</p>
      )}
    </div>
  );
};

export default WalletUnavailableNotice;
