
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { TelegramUser } from "@/types/telegram";
import { ExternalLink, AlertTriangle, RefreshCw, Smartphone, Download } from "lucide-react";

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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const [showAppStoreLinks, setShowAppStoreLinks] = useState(false);
  
  // Reset retry state when connection state changes
  useEffect(() => {
    if (!isConnecting) {
      setTimeout(() => {
        setShowRetry(false);
        setRedirectInProgress(false);
      }, 1000);
    } else {
      // Mark that a redirect is in progress (for mobile/TG connections)
      if (isMobile || isTelegramMiniApp) {
        setRedirectInProgress(true);
      }
      
      // Show retry button after a timeout
      const retryTimer = setTimeout(() => {
        setShowRetry(true);
        
        // After longer timeout, show app store links
        const appStoreTimer = setTimeout(() => {
          setShowAppStoreLinks(true);
        }, 5000);
        
        return () => clearTimeout(appStoreTimer);
      }, isMobile || isTelegramMiniApp ? 6000 : 15000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [isConnecting, isMobile, isTelegramMiniApp]);
  
  // Find if Tonkeeper is available
  const hasTonkeeper = available.some(w => 
    w.name.toLowerCase().includes('tonkeeper') || 
    (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
  );

  // Handle connect click with appropriate guidance for different environments
  const handleConnectClick = () => {
    setShowRetry(false); // Reset retry state
    setShowAppStoreLinks(false); // Hide app store links
    setConnectionAttempts(prev => prev + 1);
    
    let message = "";
    if (isTelegramMiniApp) {
      message = "This will open Tonkeeper outside Telegram. After connecting, please return to this app.";
    } else if (isMobile) {
      message = "This will open the Tonkeeper app. If you don't have it installed, please install it first, then try again.";
    }
    
    if (message && connectionAttempts === 0 && !window.confirm(message)) {
      return;
    }
    
    onConnect();
  };

  // Detect if we're on iOS
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

  const openAppStore = () => {
    if (isIOS) {
      window.location.href = "https://apps.apple.com/app/tonkeeper/id1587312458";
    } else {
      window.location.href = "https://play.google.com/store/apps/details?id=com.tonkeeper";
    }
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
            {redirectInProgress ? "Redirecting to Tonkeeper..." : "Opening Tonkeeper..."}
          </span>
        ) : showRetry ? (
          <span className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-1 text-yellow-500" />
            Try Again
          </span>
        ) : (
          isTelegramMiniApp ? (
            <>Open Tonkeeper <ExternalLink className="h-4 w-4 ml-1" /></>
          ) : isMobile ? (
            <>Open Tonkeeper App <ExternalLink className="h-4 w-4 ml-1" /></>
          ) : "Connect Tonkeeper"
        )}
      </Button>
      
      {/* App Store links - show if connection takes too long on mobile */}
      {showAppStoreLinks && isMobile && (
        <Button 
          variant="secondary"
          className="justify-start gap-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={openAppStore}
        >
          <Download className="h-4 w-4" />
          {isIOS ? "Get Tonkeeper from App Store" : "Get Tonkeeper from Play Store"}
        </Button>
      )}
      
      {showRetry && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <p className="font-medium flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> Connection taking too long</p>
          <p className="mt-1">If Tonkeeper didn't open, please try these steps:</p>
          <ol className="list-decimal pl-4 mt-1 space-y-1">
            <li>Make sure you have the Tonkeeper app installed</li>
            <li>Tap "Try Again" to make another connection attempt</li>
            {isMobile && <li>{isIOS ? "On iOS, you may need to open the App Store to install Tonkeeper" : "On Android, you may need to open the Play Store to install Tonkeeper"}</li>}
            {isTelegramMiniApp && <li>After connecting in Tonkeeper, return to this Telegram Mini App</li>}
          </ol>
        </div>
      )}
      
      {isTelegramMiniApp && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <p className="font-medium">IMPORTANT: Telegram Mini App Notice</p>
          <p><strong>You are using a Telegram Mini App.</strong> Connecting to Tonkeeper will open outside of Telegram.</p>
          <p className="mt-1">When you click the button, you should be redirected to Tonkeeper. After connecting in Tonkeeper, you <strong>must return to Telegram</strong> to complete the process.</p>
        </div>
      )}
      
      {isMobile && !isTelegramMiniApp && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-700">
          <p className="font-medium flex items-center"><Smartphone className="h-3 w-3 mr-1" /> Mobile Device Instructions</p>
          <p><strong>You need the Tonkeeper app installed</strong> on your device.</p>
          <p className="mt-1">Tapping the button will attempt to open the Tonkeeper app. If it doesn't open:</p>
          <ol className="list-decimal pl-4 mt-1 space-y-1">
            <li>Make sure Tonkeeper is installed</li>
            <li>{isIOS ? "On iOS, get Tonkeeper from the App Store" : "On Android, get Tonkeeper from the Play Store"}</li>
            <li>After installing, tap the button again</li>
          </ol>
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
          <p>User Agent: {navigator.userAgent.slice(0, 100)}...</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
