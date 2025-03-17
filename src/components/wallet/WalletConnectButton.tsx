import React, { useState, useEffect } from "react";
import { TelegramUser } from "@/types/telegram";
import ConnectButton from "./ConnectButton";
import AppStoreLinkButton from "./AppStoreLinkButton";
import RetryNotice from "./RetryNotice";
import EnvironmentNotice from "./EnvironmentNotice";
import WalletUnavailableNotice from "./WalletUnavailableNotice";
import TelegramUserInfo from "./TelegramUserInfo";
import DebugInfo from "./DebugInfo";

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
  
  // Ensure available is always an array, even if undefined
  const wallets = Array.isArray(available) ? available : [];
  
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
      
      // Show retry button after a timeout - longer for Telegram Mini Apps
      const retryTimer = setTimeout(() => {
        setShowRetry(true);
        
        // After longer timeout, show app store links
        const appStoreTimer = setTimeout(() => {
          setShowAppStoreLinks(true);
        }, 5000);
        
        return () => clearTimeout(appStoreTimer);
      }, isTelegramMiniApp ? 10000 : isMobile ? 6000 : 15000); // Give more time for Telegram Mini Apps
      
      return () => clearTimeout(retryTimer);
    }
  }, [isConnecting, isMobile, isTelegramMiniApp]);
  
  // Find if Tonkeeper is available
  const hasTonkeeper = wallets.some(w => 
    (w.name && w.name.toLowerCase().includes('tonkeeper')) || 
    (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
  );

  // Detect if we're on iOS
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

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
    
    // Only show confirmation on first attempt in mobile/Telegram environments
    if (message && connectionAttempts === 0) {
      if (window.confirm(message)) {
        onConnect();
      }
    } else {
      onConnect();
    }
  };

  const openAppStore = () => {
    if (isIOS) {
      window.location.href = "https://apps.apple.com/app/tonkeeper/id1587312458";
    } else {
      window.location.href = "https://play.google.com/store/apps/details?id=com.tonkeeper";
    }
  };

  return (
    <div className="grid gap-4">
      <ConnectButton
        isConnecting={isConnecting}
        showRetry={showRetry}
        redirectInProgress={redirectInProgress}
        isTelegramMiniApp={isTelegramMiniApp}
        isMobile={isMobile}
        onClick={handleConnectClick}
      />
      
      {/* App Store links - show if connection takes too long on mobile */}
      {showAppStoreLinks && (isMobile || isTelegramMiniApp) && (
        <AppStoreLinkButton isIOS={isIOS} onOpenAppStore={openAppStore} />
      )}
      
      {showRetry && (
        <RetryNotice
          isMobile={isMobile}
          isTelegramMiniApp={isTelegramMiniApp}
          isIOS={isIOS}
        />
      )}
      
      <EnvironmentNotice
        isTelegramMiniApp={isTelegramMiniApp}
        isMobile={isMobile}
        isIOS={isIOS}
      />
      
      <WalletUnavailableNotice
        hasTonkeeper={hasTonkeeper || (isTelegramMiniApp && isConnecting)}
        isConnecting={isConnecting}
      />
      
      <TelegramUserInfo telegramUser={telegramUser} />
      
      <DebugInfo
        walletInfo={walletInfo}
        available={wallets}
        isTelegramMiniApp={isTelegramMiniApp}
        isMobile={isMobile}
      />
    </div>
  );
};

export default WalletConnectButton;
