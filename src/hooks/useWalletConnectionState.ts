import { useState, useEffect } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";
import { detectMobileDevice, isTelegramMiniAppEnvironment, waitForTelegramWebApp } from "@/utils/environmentUtils";

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
  const [environmentDetected, setEnvironmentDetected] = useState(false);

  // Initial environment detection
  useEffect(() => {
    const detectEnvironment = async () => {
      // Check if we're inside Tonkeeper browser
      const isTonkeeperBrowser = /Tonkeeper/i.test(navigator.userAgent);
      if (isTonkeeperBrowser) {
        console.log("★★★ Detected Tonkeeper browser in wallet connection state!");
        setIsMobile(true);
      } else {
        // Check if device is mobile
        setIsMobile(detectMobileDevice());
      }
      
      // First check for Quick Telegram detection
      const quickTelegramCheck = isTelegramMiniAppEnvironment(false);
      if (quickTelegramCheck) {
        console.log("★★★ Quick Telegram Mini App detection succeeded!");
        setIsTelegramMiniApp(true);
      } else {
        console.log("Quick Telegram Mini App detection failed, waiting for WebApp initialization...");
        
        // Wait for Telegram WebApp to be available (with timeout)
        const telegramAvailable = await waitForTelegramWebApp(3000);
        
        if (telegramAvailable) {
          console.log("★★★ Telegram WebApp became available after waiting!");
          setIsTelegramMiniApp(true);
          localStorage.setItem('isTelegramMiniApp', 'true');
          localStorage.setItem('tonconnect_in_telegram', 'true');
        } else {
          // Final check - might have been set by bridge scripts after our initial check
          const storedFlag = localStorage.getItem('isTelegramMiniApp') === 'true';
          if (storedFlag) {
            console.log("★★★ Detected Telegram Mini App from localStorage flag!");
            setIsTelegramMiniApp(true);
          }
        }
      }
      
      // Mark environment detection as complete
      setEnvironmentDetected(true);
    };
    
    detectEnvironment();
    
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
    environmentDetected,
    updateConnectionState
  };
};
