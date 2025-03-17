
import { useEffect, useState } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";
import { Address } from "@ton/core";

export const useTonkeeperWallet = () => {
  const [wallet, setWallet] = useState<TonConnect | null>(null);
  const [rawAddress, setRawAddress] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [available, setAvailable] = useState<WalletInfo[]>([]);

  // Helper function to format TON address from raw format to user-friendly format
  const formatTonAddress = (rawAddress: string) => {
    try {
      if (!rawAddress) return null;
      // Convert raw address format (chain:hex) to a user-friendly format
      const addressParts = rawAddress.split(':');
      if (addressParts.length !== 2) return rawAddress;
      
      const hexAddress = addressParts[1];
      // Use @ton/core Address to format correctly
      const formattedAddress = Address.parseRaw(`${addressParts[0]}:${hexAddress}`).toString();
      return formattedAddress;
    } catch (error) {
      console.error("Error formatting TON address:", error);
      return rawAddress; // Return original if formatting fails
    }
  };

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
            setRawAddress(walletInfo.account.address);
            const formattedAddress = formatTonAddress(walletInfo.account.address);
            setAddress(formattedAddress);
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
          setRawAddress(walletInfo.account.address);
          const formattedAddress = formatTonAddress(walletInfo.account.address);
          setAddress(formattedAddress);
        } else {
          console.log("Disconnected");
          setConnected(false);
          setRawAddress(null);
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
        w.appName.toLowerCase().includes('tonkeeper')
      );
      
      if (!tonkeeperWallet) {
        console.error("Tonkeeper wallet not found among available wallets");
        return;
      }
      
      console.log("Found Tonkeeper wallet:", tonkeeperWallet);
      
      // Connect to the wallet using the TonConnect API
      // The properties will depend on the wallet type
      const result = wallet.connect({
        // Use type-safe way to connect based on wallet info
        jsBridgeKey: 'tonkeeper', // Default fallback value
        universalLink: tonkeeperWallet.universalLink || tonkeeperWallet.bridgeUrl // Try both possible properties
      });
      
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

  return { connectWallet, disconnectWallet, connected, address, rawAddress, wallet, available };
};
