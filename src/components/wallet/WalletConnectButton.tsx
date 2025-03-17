import React, { useState } from "react";
import { Button } from "@/components/ui";
import { TelegramUser } from "@/types/telegram";
import { ExternalLink, AlertTriangle } from "lucide-react";

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
  const [showRetry, setShowRetry] = useState(false);
  
  // Find if Tonkeeper is available
  const hasTonkeeper = available.some(w => 
    w.name.toLowerCase().includes('tonkeeper') || 
    (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
  );

  // Handle the connect click with guidance for different environments
  const handleConnectClick = () => {
    setShowRetry(false); // Reset retry state
    
    let message = "";
    if (isTelegramMiniApp) {
      message = "This will open Tonkeeper in a new window. After connecting, please return to this app.";
    } else if (isMobile) {
      message = "This will open the Tonkeeper app. If you don't have it installed, please install it first, then try again.";
    }
    
    if (message && !window.confirm(message)) {
      return;
    }
    
    // Show retry button after a timeout
    setTimeout(() => {
      setShowRetry(true);
    }, 10000);
    
    onConnect();
  };

  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        className="justify-start gap-2"
        onClick={handleConnectClick}
        disabled={isConnecting && !showRetry}
      >
        <img
          src="https://tonkeeper.com/assets/tonconnect-icon.png"
          alt="Tonkeeper"
          className="h-5 w-5"
        />
        {isConnecting && !showRetry ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Opening Tonkeeper...
          </span>
        ) : showRetry ? (
          <>Try Again <AlertTriangle className="h-4 w-4 ml-1 text-yellow-500" /></>
        ) : (
          isTelegramMiniApp ? (
            <>Open Tonkeeper <ExternalLink className="h-4 w-4 ml-1" /></>
          ) : isMobile ? (
            <>Open Tonkeeper App <ExternalLink className="h-4 w-4 ml-1" /></>
          ) : "Connect Tonkeeper"
        )}
      </Button>
      
      {showRetry && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
          <p className="font-medium">Connection taking too long?</p>
          <p>If Tonkeeper didn't open or you were unable to connect, try again or check if you have the app installed.</p>
        </div>
      )}
      
      {isMobile && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <p className="font-medium">Mobile Device Detected</p>
          <p><strong>You need the Tonkeeper app installed</strong> for this to work.</p>
          <p className="mt-1">Clicking will attempt to open the Tonkeeper app. If it doesn't open, please install it from your app store first.</p>
          <p className="mt-1">After connecting in Tonkeeper, return to this browser tab.</p>
        </div>
      )}
      
      {isTelegramMiniApp && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <p className="font-medium">Important</p>
          <p>Clicking will open Tonkeeper outside this app. After connecting, please return here.</p>
          <p className="mt-1">If nothing happens, please try again or open Tonkeeper manually.</p>
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
