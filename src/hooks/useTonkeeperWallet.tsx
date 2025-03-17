
import { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";

export const useTonkeeperWallet = () => {
  const [wallet, setWallet] = useState<TonConnect | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize TonConnect with the correct manifest URL
    // Using relative URL to avoid CORS issues
    const connector = new TonConnect({
      manifestUrl: '/tonconnect-manifest.json',
    });

    setWallet(connector);
    console.log("TonConnect initialized with manifest", connector);

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
        setConnected(true);
        setAddress(walletInfo.account.address);
      } else {
        setConnected(false);
        setAddress(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const connectWallet = async () => {
    if (!wallet) {
      console.error("Wallet instance is not initialized");
      return;
    }

    try {
      console.log("Attempting to connect wallet...");
      // The empty array is for wallet features we want to use
      const result = await wallet.connect({ 
        universalLink: 'https://app.tonkeeper.com/ton-connect',
        bridgeUrl: 'https://bridge.tonapi.io/bridge'
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

  return { connectWallet, disconnectWallet, connected, address };
};
