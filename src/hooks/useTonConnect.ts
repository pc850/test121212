
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TonClient } from "@ton/ton";
import { TonConnect, WalletInfo, WalletInfoRemote, WalletInfoInjected } from "@tonconnect/sdk";

// Define TON Connect manifest
const manifestUrl = 'https://fipt-shop.app/tonconnect-manifest.json';

export function useTonConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState<string | null>(null);
  const [tonConnectUI, setTonConnectUI] = useState<TonConnect | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  
  // Initialize TON client
  const tonClient = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC', // Using public TON API endpoint
  });

  // Initialize TonConnect
  useEffect(() => {
    const connector = new TonConnect({ manifestUrl });
    setTonConnectUI(connector);

    // Check if there's an active connection
    if (connector.connected) {
      const wallet = connector.wallet;
      if (wallet) {
        setIsConnected(true);
        setWalletAddress(wallet.account.address);
        setProvider(wallet.device.appName);
      }
    }

    // Get available wallets
    const getWallets = async () => {
      try {
        const walletsList = await connector.getWallets();
        setAvailableWallets(walletsList);
      } catch (error) {
        console.error("Error getting available wallets:", error);
      }
    };
    getWallets();

    // Listen for connection changes
    const unsubscribe = connector.onStatusChange((wallet) => {
      if (wallet) {
        setIsConnected(true);
        setWalletAddress(wallet.account.address);
        setProvider(wallet.device.appName);
        saveWalletConnection(wallet.account.address, wallet.device.appName);
      } else {
        setIsConnected(false);
        setWalletAddress("");
        setProvider(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  const saveWalletConnection = async (address: string, provider: string) => {
    try {
      const { data: existingWallet } = await supabase
        .from('connected_wallets')
        .select('*')
        .eq('wallet_address', address)
        .single();
      
      if (!existingWallet) {
        await supabase.from('connected_wallets').insert([
          { wallet_address: address, provider: provider, is_active: true }
        ]);
      } else {
        await supabase
          .from('connected_wallets')
          .update({ is_active: true, provider: provider })
          .eq('wallet_address', address);
      }
    } catch (error) {
      console.error("Error saving wallet connection:", error);
    }
  };

  // For development and demo purposes
  const mockConnect = useCallback(async (walletType: string) => {
    setIsConnecting(true);
    try {
      // In a real implementation, this would trigger the wallet connection
      // For now, we'll simulate a successful connection with a fake address
      const mockAddress = "UQ" + Math.random().toString(16).slice(2, 10).toUpperCase() + "...";
      
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setProvider(walletType);
      
      // Save to Supabase
      await saveWalletConnection(mockAddress, walletType);
      
      return mockAddress;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Connect to a real wallet using TON Connect
  const connectToWallet = useCallback(async (walletName: string) => {
    if (!tonConnectUI) return null;
    
    setIsConnecting(true);
    try {
      // Find the wallet by name
      const walletInfo = availableWallets.find(w => {
        // Check both injected and remote wallets
        if ('jsBridgeKey' in w) {
          return w.name.toLowerCase() === walletName.toLowerCase();
        } else {
          return w.name.toLowerCase() === walletName.toLowerCase();
        }
      });
      
      if (!walletInfo) {
        console.error(`Wallet ${walletName} not found`);
        return null;
      }
      
      // Connect to the selected wallet
      if ('bridgeUrl' in walletInfo) {
        // Universal link/bridge url flow for mobile wallets
        await tonConnectUI.connect({ universalLink: walletInfo.universalLink, bridgeUrl: walletInfo.bridgeUrl });
      } else if ('jsBridgeKey' in walletInfo) {
        // JS Bridge for web wallets
        await tonConnectUI.connect({ jsBridgeKey: walletInfo.jsBridgeKey });
      } else {
        console.error("Unknown wallet connection type");
        return null;
      }
      
      // The connection status will be handled by the onStatusChange listener
      // We return the address here for immediate UI feedback
      return tonConnectUI.wallet?.account.address;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [tonConnectUI, availableWallets]);

  // Connect specifically to Tonkeeper
  const connectToTonkeeper = useCallback(async () => {
    return await connectToWallet("tonkeeper");
  }, [connectToWallet]);

  const disconnect = useCallback(async () => {
    try {
      if (tonConnectUI) {
        await tonConnectUI.disconnect();
      }
      
      if (walletAddress) {
        await supabase
          .from('connected_wallets')
          .update({ is_active: false })
          .eq('wallet_address', walletAddress);
      }
      
      setIsConnected(false);
      setWalletAddress("");
      setProvider(null);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [walletAddress, tonConnectUI]);

  return {
    isConnecting,
    isConnected,
    walletAddress,
    provider,
    mockConnect,
    connectToWallet,
    connectToTonkeeper,
    disconnect,
    tonClient,
    wallets: availableWallets
  };
}
