
import { useEffect, useState } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";
import { Address } from "@ton/core";

export const useTonkeeperWallet = () => {
  const [wallet, setWallet] = useState<TonConnect | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [rawAddress, setRawAddress] = useState<string | null>(null);
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
            const rawAddr = walletInfo.account.address;
            setRawAddress(rawAddr);
            
            // Convert raw address to user-friendly format
            try {
              const userFriendlyAddress = Address.parseRaw(rawAddr).toString();
              console.log("Formatted address:", userFriendlyAddress);
              setAddress(userFriendlyAddress);
            } catch (error) {
              console.error("Failed to format address:", error);
              setAddress(rawAddr); // Fallback to raw address
            }
            
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
          
          const rawAddr = walletInfo.account.address;
          setRawAddress(rawAddr);
          
          // Convert raw address to user-friendly format
          try {
            const userFriendlyAddress = Address.parseRaw(rawAddr).toString();
            console.log("Formatted address:", userFriendlyAddress);
            setAddress(userFriendlyAddress);
          } catch (error) {
            console.error("Failed to format address:", error);
            setAddress(rawAddr); // Fallback to raw address
          }
          
          setConnected(true);
        } else {
          console.log("Disconnected");
          setConnected(false);
          setAddress(null);
          setRawAddress(null);
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
        // Using the required properties based on wallet type
        jsBridgeKey: 'tonkeeper', // Default fallback value
        universalLink: tonkeeperWallet.hasOwnProperty('universalLink') 
          ? (tonkeeperWallet as any).universalLink 
          : (tonkeeperWallet.hasOwnProperty('bridgeUrl') 
            ? (tonkeeperWallet as any).bridgeUrl 
            : undefined)
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
