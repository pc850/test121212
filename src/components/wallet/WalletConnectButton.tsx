import React from "react";
import { Button } from "@/components/ui";
import { TelegramUser } from "@/types/telegram";
import { ExternalLink } from "lucide-react";

interface WalletConnectButtonProps {
  isConnecting: boolean;
  telegramUser: TelegramUser | null;
  walletInfo: string;
  available: any[];
  onConnect: () => void;
  isMobile?: boolean;
  isTelegramMiniApp?: boolean;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  isConnecting,
  telegramUser,
  walletInfo,
  available,
  onConnect,
  isMobile = false,
  isTelegramMiniApp = false
}) => {
  // Find if Tonkeeper is available
  const hasTonkeeper = available.some(w => 
    w.name.toLowerCase().includes('tonkeeper') || 
    (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
  );

  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        className="justify-start gap-2"
        onClick={onConnect}
        disabled={isConnecting}
      >
        <img
          src="https://tonkeeper.com/assets/tonconnect-icon.png"
          alt="Tonkeeper"
          className="h-5 w-5"
        />
        {isConnecting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Opening Tonkeeper...
          </span>
        ) : (
          isTelegramMiniApp ? (
            <>Open Tonkeeper <ExternalLink className="h-4 w-4" /></>
          ) : isMobile ? (
            <>Open Tonkeeper App <ExternalLink className="h-4 w-4" /></>
          ) : "Connect Tonkeeper"
        )}
      </Button>
      
      {isTelegramMiniApp && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <p className="font-medium">Important</p>
          <p>Clicking will open Tonkeeper outside this app. After connecting, please return here.</p>
          <p className="mt-1">If nothing happens, please try again or open Tonkeeper manually.</p>
        </div>
      )}
      
      {isMobile && !isTelegramMiniApp && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <p className="font-medium">Mobile Device</p>
          <p>Clicking will open the Tonkeeper app. Approve the connection there and return to this app.</p>
        </div>
      )}
      
      {!hasTonkeeper && !isConnecting && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
          <p className="font-medium">Tonkeeper Not Found</p>
          <p>Tonkeeper wallet is not available. You may need to install the Tonkeeper app or extension first.</p>
        </div>
      )}
      
      {telegramUser && (
        <div className="p-2 bg-muted rounded-md text-xs text-muted-foreground">
          <p>Connecting will link your wallet to your Telegram account:</p>
          <p className="font-medium mt-1">@{telegramUser.username || telegramUser.first_name}</p>
        </div>
      )}
      
      {/* Debug info - only show in development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
          <p className="font-medium">Debug Info:</p>
          <p className="break-all">{walletInfo}</p>
          <p className="font-medium mt-2">Available Wallets:</p>
          <p className="break-all">{available.length > 0 ? available.map(w => w.name).join(', ') : 'None found'}</p>
          <p className="font-medium mt-2">Environment:</p>
          <p>Telegram Mini App: {String(isTelegramMiniApp)}, Mobile: {String(isMobile)}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
