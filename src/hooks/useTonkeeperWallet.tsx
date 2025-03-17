
import { useEffect, useState } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";
import { useTonConnectManager } from "./useTonConnectManager";

export const useTonkeeperWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [available, setAvailable] = useState<WalletInfo[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    wallet,
    initializeWallet,
    checkExistingConnection,
    subscribeToWalletChanges
  } = useTonConnectManager({
    onWalletConnected: (walletAddress) => {
      setConnected(true);
      setAddress(walletAddress);
    },
    onWalletDisconnected: () => {
      setConnected(false);
      setAddress(null);
    },
    onWalletsAvailable: (availableWallets) => {
      setAvailable(availableWallets);
    }
  });
  
  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    setIsMobile(checkMobile());
    initializeWallet();
    const unsubscribe = subscribeToWalletChanges();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeWallet, subscribeToWalletChanges]);

  const connectWallet = async () => {
    if (!wallet) {
      console.error("Wallet instance is not initialized");
      return;
    }

    try {
      console.log("Attempting to connect wallet...");
      console.log("Is mobile device:", isMobile);
      
      // Get tonkeeper from available wallets
      const tonkeeperWallet = available.find(w => 
        w.name.toLowerCase().includes('tonkeeper') || 
        (w as any).appName?.toLowerCase().includes('tonkeeper') || 
        (typeof w === 'object' && 'id' in w && (w as any).id.toLowerCase().includes('tonkeeper'))
      );
      
      if (!tonkeeperWallet) {
        console.error("Tonkeeper wallet not found among available wallets");
        return;
      }
      
      console.log("Found Tonkeeper wallet:", tonkeeperWallet);
      
      // Mobile devices need special handling
      if (isMobile) {
        console.log("Using mobile connection flow");
        
        // Check if wallet has embedded properties for universal or deep links
        // TypeScript doesn't know about these properties, so we need to use 'as any'
        const walletAny = tonkeeperWallet as any;
        
        if (walletAny.universalLink) {
          console.log("Universal link found:", walletAny.universalLink);
          
          // For TonConnect SDK v3, we need to pass the correct options structure
          const result = wallet.connect(tonkeeperWallet, {
            // Empty object for additional request parameters
          });
          
          console.log("Mobile connection initiated:", result);
          return result;
        } else if (walletAny.deepLink) {
          console.log("Deep link found:", walletAny.deepLink);
          // Try deep link as fallback by directly navigating to it
          window.location.href = walletAny.deepLink;
          return;
        } else {
          // If no special links are found, try the standard connection method
          const result = wallet.connect(tonkeeperWallet);
          console.log("Standard mobile connection initiated:", result);
          return result;
        }
      }
      
      // Desktop flow - simple connection
      const result = wallet.connect(tonkeeperWallet);
      console.log("Desktop connection initiated:", result);
      return result;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    if (wallet) {
      console.log("Disconnecting wallet...");
      wallet.disconnect();
    }
  };

  return { connectWallet, disconnectWallet, connected, address, wallet, available, isMobile };
};
