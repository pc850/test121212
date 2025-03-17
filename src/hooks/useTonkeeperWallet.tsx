import { useEffect, useState } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";

export const useTonkeeperWallet = () => {
  const [wallet, setWallet] = useState<TonConnect | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [available, setAvailable] = useState<WalletInfo[]>([]);

  useEffect(() => {
    try {
      // Use the absolute URL to the manifest file
      const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
      console.log("Using manifest URL:", manifestUrl);
      
      const connector = new TonConnect({
        manifestUrl
      });

      setWallet(connector);
      console.log("TonConnect initialized with manifest", connector);

      // Get available wallets
      const getWallets = async () => {
        const wallets = await connector.getWallets();
        console.log("Available wallets:", wallets);
        setAvailable(wallets);
      };
      
      getWallets();

      // Check for existing connection
      const checkConnection = async () => {
        console.log("Checking existing connection...");
        if (connector.connected) {
          const walletInfo = connector.wallet;
          console.log("Already connected to wallet:", walletInfo);
          if (walletInfo?.account.address) {
            setAddress(walletInfo.account.address);
            setConnected(true);
          }
        } else {
          console.log("No existing connection found");
        }
      };

      checkConnection();

      // Subscribe to connection status changes
      const unsubscribe = connector.onStatusChange((walletInfo) => {
        console.log("Wallet status changed:", walletInfo);
        if (walletInfo && walletInfo.account) {
          console.log("Connected with address:", walletInfo.account.address);
          setConnected(true);
          setAddress(walletInfo.account.address);
        } else {
          console.log("Disconnected");
          setConnected(false);
          setAddress(null);
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error initializing TonConnect:", error);
    }
  }, []);

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
        w.id.toLowerCase().includes('tonkeeper')
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
