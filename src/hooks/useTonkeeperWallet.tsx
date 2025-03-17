
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTonConnectManager } from "./useTonConnectManager";
import { useWalletConnectionState } from "./useWalletConnectionState";
import { connectToTonkeeper } from "@/utils/walletConnectionUtils";
import { TelegramUser } from "@/types/telegram";

export const useTonkeeperWallet = () => {
  const {
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
  } = useWalletConnectionState(null);
  
  const [isReady, setIsReady] = useState(false);
  
  const {
    wallet,
    initializeWallet,
    checkExistingConnection,
    subscribeToWalletChanges
  } = useTonConnectManager({
    onWalletConnected: (walletAddress) => {
      console.log("Wallet connected callback with address:", walletAddress);
      updateConnectionState(true, walletAddress);
      
      toast({
        title: "Wallet Connected",
        description: "Your Tonkeeper wallet is now connected"
      });
    },
    onWalletDisconnected: () => {
      console.log("Wallet disconnected callback");
      updateConnectionState(false, null);
    },
    onWalletsAvailable: (availableWallets) => {
      console.log("Wallets available callback:", availableWallets.length);
      setAvailable(availableWallets);
      
      // Mark wallet as ready once we have available wallets
      if (availableWallets.length > 0) {
        setIsReady(true);
      }
    }
  });
  
  useEffect(() => {
    // Only initialize wallet once environment detection is complete
    if (environmentDetected) {
      console.log("Environment detection complete, initializing wallet with isTelegramMiniApp:", isTelegramMiniApp);
      initializeWallet();
      const unsubscribe = subscribeToWalletChanges();
      
      return () => {
        if (unsubscribe) unsubscribe();
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
      };
    }
  }, [initializeWallet, subscribeToWalletChanges, connectionTimeout, environmentDetected, isTelegramMiniApp]);

  const connectWallet = async () => {
    if (!wallet) {
      console.error("Wallet instance is not initialized");
      return;
    }
    
    if (!isReady) {
      console.log("Waiting for wallet to be ready before connecting...");
      toast({
        title: "Please wait",
        description: "Wallet is still initializing. Please try again in a moment."
      });
      return;
    }
    
    // Always use forceMobile=true if on mobile according to user agent
    const forceMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (forceMobile && !isMobile) {
      console.log("Force setting mobile mode based on user agent");
    }

    return connectToTonkeeper(
      wallet,
      available,
      forceMobile || isMobile,
      isTelegramMiniApp,
      setIsConnecting,
      setConnectionTimeout,
      connectionTimeout
    );
  };

  const disconnectWallet = () => {
    if (wallet) {
      console.log("Disconnecting wallet...");
      wallet.disconnect();
    }
  };

  return { 
    connectWallet, 
    disconnectWallet, 
    connected, 
    address, 
    wallet, 
    available, 
    isMobile,
    isConnecting,
    isTelegramMiniApp,
    isReady
  };
};
