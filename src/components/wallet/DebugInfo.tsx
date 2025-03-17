
import React from "react";

interface DebugInfoProps {
  walletInfo: string;
  available: any[];
  isTelegramMiniApp: boolean;
  isMobile: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ 
  walletInfo,
  available,
  isTelegramMiniApp,
  isMobile
}) => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
      <p className="font-medium">Debug Info:</p>
      <p className="break-all">{walletInfo}</p>
      <p className="font-medium mt-2">Available Wallets:</p>
      <p className="break-all">{available.length > 0 ? available.map(w => w.name).join(', ') : 'None found'}</p>
      <p className="font-medium mt-2">Environment:</p>
      <p>Telegram Mini App: {String(isTelegramMiniApp)}, Mobile: {String(isMobile)}</p>
      <p>User Agent: {navigator.userAgent.slice(0, 100)}...</p>
    </div>
  );
};

export default DebugInfo;
