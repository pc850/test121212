import { useState, useEffect } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";
import { detectMobileDevice, isTelegramMiniAppEnvironment } from "@/utils/environmentUtils";

/**
 * Hook to manage wallet connection state
 */
export const useWalletConnectionState = (wallet: TonConnect | null) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [available, setAvailable] = useState<WalletInfo[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionTimeout, setConnectionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);

  useEffect(() => {
    // Check if we're inside Tonkeeper browser
    const isTonkeeperBrowser = /Tonkeeper/i.test(navigator.userAgent);
    if (isTonkeeperBrowser) {
      console.log("★★★ Detected Tonkeeper browser in wallet connection state!");
      setIsMobile(true);
    } else {
      // Check if device is mobile
      setIsMobile(detectMobileDevice());
    }
    
    // Check if running in Telegram Mini App
    setIsTelegramMiniApp(isTelegramMiniAppEnvironment());
    
    // Clear any timeouts when unmounting
    return () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [connectionTimeout]);

  const updateConnectionState = (isConnected: boolean, walletAddress: string | null) => {
    setConnected(isConnected);
    setAddress(walletAddress);
    setIsConnecting(false);
    
    // Clear any timeout if it exists
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
      setConnectionTimeout(null);
    }
  };

  return {
    address,
    connected,
    available,
    setAvailable,
    isMobile,
    isConnecting,
    setIsConnecting,
    connectionTimeout,
    setConnectionTimeout,
    isTelegramMiniApp,
    updateConnectionState
  };
};
