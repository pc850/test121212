import { WalletInfo } from "@tonconnect/sdk";
import { toast } from "@/hooks/use-toast";

/**
 * Attempts to connect to a Tonkeeper wallet with special handling for Telegram Mini Apps and mobile devices
 */
export const connectToTonkeeper = async (
  wallet: any,
  available: WalletInfo[],
  isMobile: boolean,
  isTelegramMiniApp: boolean,
  setIsConnecting: (isConnecting: boolean) => void,
  setConnectionTimeout: (timeout: NodeJS.Timeout | null) => void,
  connectionTimeout: NodeJS.Timeout | null
) => {
  try {
    console.log("Attempting to connect wallet...");
    setIsConnecting(true);
    
    // Clear any existing timeout
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
      setConnectionTimeout(null);
    }
    
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
    
    // Set a connection timeout - shorter now for better UX
    const timeout = setTimeout(() => {
      console.log("Connection timeout reached");
      setIsConnecting(false);
      toast({
        title: "Connection Timeout",
        description: "Please try connecting again",
        variant: "destructive"
      });
    }, 15000); // 15 seconds timeout
    
    setConnectionTimeout(timeout);
    
    // First approach: direct universal link for all environments for reliability
    try {
      console.log("Using direct universal link approach first");
      
      // Cast to any to access properties that might not be in the TypeScript interface
      const walletAny = tonkeeperWallet as any;
      
      // Get universal link if available
      let universalLink = walletAny.universalUrl || walletAny.universal_url;
      
      if (universalLink) {
        // Add tonconnect=true parameter to ensure the connect flow is triggered
        if (!universalLink.includes('?')) {
          universalLink += '?tonconnect=true&ret=' + encodeURIComponent(window.location.href);
        } else {
          universalLink += '&tonconnect=true&ret=' + encodeURIComponent(window.location.href);
        }
        
        console.log("Opening Tonkeeper with universal link:", universalLink);
        
        // For Telegram Mini App or mobile, open in a new window to break out of the iframe
        if (isTelegramMiniApp || isMobile) {
          window.open(universalLink, '_blank');
        } else {
          // For desktop, use the redirect approach
          window.location.href = universalLink;
        }
        
        // Short timeout to allow for proper redirection
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }
    } catch (err) {
      console.error("Direct universal link approach failed:", err);
      // Continue to try other methods
    }
    
    // Second approach: Use the TonConnect SDK
    try {
      console.log("Attempting standard SDK connection");
      const result = await wallet.connect(tonkeeperWallet);
      console.log("Connection initiated with standard method:", result);
      
      // If we get a redirect URL, use it
      if (typeof result === 'string' && result) {
        console.log("Got redirect URL from connect method:", result);
        if (isTelegramMiniApp) {
          window.open(result, '_blank');
        } else {
          window.location.href = result;
        }
        return;
      }
      
      return result;
    } catch (connectionError) {
      console.error("Standard connection failed, trying fallback methods:", connectionError);
      
      // Third approach: Try deepLink as a last resort
      const walletAny = tonkeeperWallet as any;
      if (walletAny.deepLink) {
        console.log("Navigating to deep link:", walletAny.deepLink);
        if (isTelegramMiniApp) {
          window.open(walletAny.deepLink, '_blank');
        } else {
          window.location.href = walletAny.deepLink;
        }
        return;
      }
      
      // If we reach here, all connection attempts have failed
      setIsConnecting(false);
      clearTimeout(timeout);
      setConnectionTimeout(null);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to Tonkeeper. Please try again.",
        variant: "destructive"
      });
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
      description: "Failed to open Tonkeeper",
      variant: "destructive"
    });
  }
};

/**
 * Detects if the current device is a mobile device
 */
export const detectMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Checks if the app is running as a Telegram Mini App
 */
export const isTelegramMiniAppEnvironment = (): boolean => {
  return window.Telegram?.WebApp !== undefined || localStorage.getItem('isTelegramMiniApp') === 'true';
};
