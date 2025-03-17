
import { useEffect, useState } from "react";
import { TonConnect, WalletInfo } from "@tonconnect/sdk";
import { useTonConnectManager } from "./useTonConnectManager";
import { toast } from "@/hooks/use-toast";

export const useTonkeeperWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [available, setAvailable] = useState<WalletInfo[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionTimeout, setConnectionTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const {
    wallet,
    initializeWallet,
    checkExistingConnection,
    subscribeToWalletChanges
  } = useTonConnectManager({
    onWalletConnected: (walletAddress) => {
      console.log("Wallet connected callback with address:", walletAddress);
      setConnected(true);
      setAddress(walletAddress);
      setIsConnecting(false);
      
      // Clear any timeout if it exists
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }
      
      toast({
        title: "Wallet Connected",
        description: "Your Tonkeeper wallet is now connected"
      });
    },
    onWalletDisconnected: () => {
      console.log("Wallet disconnected callback");
      setConnected(false);
      setAddress(null);
      setIsConnecting(false);
      
      // Clear any timeout if it exists
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }
    },
    onWalletsAvailable: (availableWallets) => {
      console.log("Wallets available callback:", availableWallets.length);
      setAvailable(availableWallets);
    }
  });
  
  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    setIsMobile(checkMobile());
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

    try {
      console.log("Attempting to connect wallet...");
      setIsConnecting(true);
      console.log("Is mobile device:", isMobile);
      
      // Get all available wallet options
      console.log("Available wallets:", available.map(w => w.name));
      
      // Get tonkeeper from available wallets
      const tonkeeperWallet = available.find(w => 
        w.name.toLowerCase().includes('tonkeeper') || 
        ((w as any).appName && (w as any).appName.toLowerCase().includes('tonkeeper'))
      );
      
      if (!tonkeeperWallet) {
        console.error("Tonkeeper wallet not found among available wallets");
        setIsConnecting(false);
        toast({
          title: "Connection Error",
          description: "Tonkeeper wallet not found",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Found Tonkeeper wallet:", tonkeeperWallet);
      
      // Set a connection timeout
      const timeout = setTimeout(() => {
        console.log("Connection timeout reached");
        setIsConnecting(false);
        toast({
          title: "Connection Timeout",
          description: "Please try connecting again or check if Tonkeeper is installed",
          variant: "destructive"
        });
      }, 20000); // 20 seconds timeout
      
      setConnectionTimeout(timeout);
      
      // Mobile devices need special handling
      if (isMobile) {
        console.log("Using mobile connection flow");
        
        // Cast to any to access properties that might not be in the TypeScript interface
        const walletAny = tonkeeperWallet as any;
        
        try {
          // Standard TonConnect SDK connection attempt first
          console.log("Attempting standard SDK connection for mobile");
          const result = wallet.connect(tonkeeperWallet);
          console.log("Mobile connection initiated with standard method:", result);
          
          // Handle deep linking on mobile
          if (typeof result === 'string' && result) {
            console.log("Got redirect URL from connect method:", result);
            window.location.href = result;
            return;
          }
          
          // If we don't get a redirect URL but have universal or deep links, use them as fallback
          if (walletAny.universalLink) {
            console.log("Using universal link as fallback:", walletAny.universalLink);
            window.location.href = walletAny.universalLink;
            return;
          } else if (walletAny.deepLink) {
            console.log("Using deep link as fallback:", walletAny.deepLink);
            window.location.href = walletAny.deepLink;
            return;
          }
          
          return result;
        } catch (connectionError) {
          console.error("Standard connection failed, trying fallback methods:", connectionError);
          
          // Fallback: try direct URL navigation if available
          if (walletAny.universalLink) {
            console.log("Navigating to universal link:", walletAny.universalLink);
            window.location.href = walletAny.universalLink;
            return;
          } else if (walletAny.deepLink) {
            console.log("Navigating to deep link:", walletAny.deepLink);
            window.location.href = walletAny.deepLink;
            return;
          }
          
          setIsConnecting(false);
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            setConnectionTimeout(null);
          }
          
          toast({
            title: "Connection Error",
            description: "Failed to connect to Tonkeeper",
            variant: "destructive"
          });
          
          throw connectionError;
        }
      }
      
      // Desktop flow - simple connection
      console.log("Using desktop connection flow");
      try {
        const result = wallet.connect(tonkeeperWallet);
        console.log("Desktop connection initiated:", result);
        return result;
      } catch (err) {
        console.error("Desktop connection error:", err);
        setIsConnecting(false);
        
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          setConnectionTimeout(null);
        }
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to Tonkeeper",
          variant: "destructive"
        });
        
        throw err;
      }
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnecting(false);
      
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to wallet",
        variant: "destructive"
      });
      
      throw error;
    }
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
    isConnecting
  };
};
