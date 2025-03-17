
import { useEffect } from "react";
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
    updateConnectionState
  } = useWalletConnectionState(null);
  
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
    }
  });
  
  useEffect(() => {
    initializeWallet();
    const unsubscribe = subscribeToWalletChanges();
    
    return () => {
      if (unsubscribe) unsubscribe();
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [initializeWallet, subscribeToWalletChanges, connectionTimeout]);

  const connectWallet = async () => {
    if (!wallet) {
      console.error("Wallet instance is not initialized");
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
    isTelegramMiniApp
  };
};
