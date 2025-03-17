
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TonClient } from "@ton/ton";
import { Address } from "@ton/core";

export function useTonConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState<string | null>(null);
  
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

  const mockConnect = useCallback(async (walletType: string) => {
    setIsConnecting(true);
    try {
      // Generate a mock TON address for demo purposes
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

  const disconnect = useCallback(async () => {
    try {
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
  }, [walletAddress]);

  return {
    isConnecting,
    isConnected,
    walletAddress,
    provider,
    mockConnect,
    disconnect
  };
}
