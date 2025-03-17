
import { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";

export const useTonkeeperWallet = () => {
  const [wallet, setWallet] = useState<TonConnect | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    try {
      // Use the relative path to the manifest in the public folder
      const connector = new TonConnect({
        manifestUrl: '/tonconnect-manifest.json'
      });

      setWallet(connector);
      console.log("TonConnect initialized with manifest", connector);

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
      
      // List available wallets for debugging
      const wallets = await wallet.getWallets();
      console.log("Available wallets:", wallets);
      
      // Connect using mobile-friendly parameters
      const result = await wallet.connect({
        universalUrl: "https://app.tonkeeper.com/ton-connect",
        bridgeUrl: "https://bridge.tonapi.io/bridge"
      });
      
      console.log("Connection result:", result);
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

  return { connectWallet, disconnectWallet, connected, address, wallet };
};
