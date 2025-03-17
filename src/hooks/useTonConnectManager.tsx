
import { useCallback, useState, useRef } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";

interface TonConnectManagerProps {
  onWalletConnected: (address: string) => void;
  onWalletDisconnected: () => void;
  onWalletsAvailable: (wallets: WalletInfo[]) => void;
}

export const useTonConnectManager = ({
  onWalletConnected,
  onWalletDisconnected,
  onWalletsAvailable
}: TonConnectManagerProps) => {
  const [wallet, setWallet] = useState<TonConnect | null>(null);
  const isInitialized = useRef(false);
  
  const initializeWallet = useCallback(() => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      console.log("TonConnect already initialized, skipping");
      return wallet;
    }
    
    try {
      // Use the absolute URL to the manifest file
      const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
      console.log("Using manifest URL:", manifestUrl);
      
      const connector = new TonConnect({
        manifestUrl
      });

      setWallet(connector);
      isInitialized.current = true;
      console.log("TonConnect initialized with manifest", connector);

      // Get available wallets
      getAvailableWallets(connector);
      
      // Check for existing connection
      checkExistingConnection(connector);
      
      return connector;
    } catch (error) {
      console.error("Error initializing TonConnect:", error);
      return null;
    }
  }, []);
  
  const getAvailableWallets = useCallback(async (connector: TonConnect) => {
    try {
      const wallets = await connector.getWallets();
      console.log("Available wallets:", wallets);
      onWalletsAvailable(wallets);
    } catch (error) {
      console.error("Error getting available wallets:", error);
      onWalletsAvailable([]);
    }
  }, [onWalletsAvailable]);
  
  const checkExistingConnection = useCallback((connector: TonConnect) => {
    console.log("Checking existing connection...");
    if (connector.connected) {
      const walletInfo = connector.wallet;
      console.log("Already connected to wallet:", walletInfo);
      if (walletInfo?.account.address) {
        onWalletConnected(walletInfo.account.address);
      }
    } else {
      console.log("No existing connection found");
      onWalletDisconnected();
    }
  }, [onWalletConnected, onWalletDisconnected]);
  
  const subscribeToWalletChanges = useCallback(() => {
    if (!wallet) return;
    
    const unsubscribe = wallet.onStatusChange((walletInfo) => {
      console.log("Wallet status changed:", walletInfo);
      if (walletInfo && walletInfo.account) {
        console.log("Connected with address:", walletInfo.account.address);
        onWalletConnected(walletInfo.account.address);
      } else {
        console.log("Disconnected");
        onWalletDisconnected();
      }
    });
    
    return unsubscribe;
  }, [wallet, onWalletConnected, onWalletDisconnected]);
  
  return {
    wallet,
    initializeWallet,
    checkExistingConnection,
    subscribeToWalletChanges
  };
};
