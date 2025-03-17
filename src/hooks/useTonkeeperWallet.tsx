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
      
      // Get all available wallet options
      console.log("Available wallets:", available.map(w => w.name));
      
      // Get tonkeeper from available wallets
      const tonkeeperWallet = available.find(w => 
        w.name.toLowerCase().includes('tonkeeper') || 
        ((w as any).appName && (w as any).appName.toLowerCase().includes('tonkeeper'))
      );
      
      if (!tonkeeperWallet) {
        console.error("Tonkeeper wallet not found among available wallets");
        return;
      }
      
      console.log("Found Tonkeeper wallet:", tonkeeperWallet);
      
      // Mobile devices need special handling
      if (isMobile) {
        console.log("Using mobile connection flow");
        
        // Cast to any to access properties that might not be in the TypeScript interface
        const walletAny = tonkeeperWallet as any;
        
        try {
          // Standard connection for mobile - this will work for TonConnect v3
          const result = wallet.connect(tonkeeperWallet);
          console.log("Mobile connection initiated with standard method:", result);
          
          // If we have a universal link and the result doesn't include a redirect URL, 
          // we might need to handle the redirect manually
          if (walletAny.universalLink && typeof result !== 'string') {
            console.log("Using universal link as fallback:", walletAny.universalLink);
            window.location.href = walletAny.universalLink;
          }
          
          return result;
        } catch (connectionError) {
          console.error("Standard connection failed, trying fallback methods:", connectionError);
          
          // Fallback: try direct URL navigation if available
          if (walletAny.universalLink) {
            console.log("Navigating to universal link:", walletAny.universalLink);
            window.location.href = walletAny.universalLink;
            return;
          } else if (walletAny.deepLink) {
            console.log("Navigating to deep link:", walletAny.deepLink);
            window.location.href = walletAny.deepLink;
            return;
          }
          
          throw connectionError;
        }
      }
      
      // Desktop flow - simple connection
      console.log("Using desktop connection flow");
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
