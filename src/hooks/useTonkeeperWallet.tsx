import { useEffect, useState } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";
import { useTonConnectManager } from "./useTonConnectManager";

export const useTonkeeperWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [available, setAvailable] = useState<WalletInfo[]>([]);
  
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
      
      // Connect without using jsBridgeKey and universalLink
      const result = wallet.connect(tonkeeperWallet);
      
      console.log("Connection initiated:", result);
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

  return { connectWallet, disconnectWallet, connected, address, wallet, available };
};
