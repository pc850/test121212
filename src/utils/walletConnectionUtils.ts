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
    console.log("Is Telegram Mini App:", isTelegramMiniApp);
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
    
    // Handle Telegram Mini App and mobile devices specifically
    if (isTelegramMiniApp || isMobile) {
      console.log("Using Telegram Mini App or mobile connection flow");
      
      // Cast to any to access properties that might not be in the TypeScript interface
      const walletAny = tonkeeperWallet as any;
      
      // Special handling for Telegram Mini App - use direct universal link
      if (isTelegramMiniApp) {
        console.log("Using direct universal link for Telegram Mini App");
        
        // Construct a universal link with proper parameters
        let universalLink = walletAny.universalUrl || walletAny.universal_url;
        
        if (universalLink) {
          // Add tonconnect=true parameter to ensure the connect flow is triggered
          if (!universalLink.includes('?')) {
            universalLink += '?tonconnect=true&ret=' + encodeURIComponent(window.location.href);
          } else {
            universalLink += '&tonconnect=true&ret=' + encodeURIComponent(window.location.href);
          }
          
          console.log("Opening Tonkeeper with link:", universalLink);
          
          // Open in a new window/tab
          window.open(universalLink, '_blank');
          return;
        }
        
        // Fallback to standard SDK connection if universal link is not available
        console.log("No universal link found, falling back to standard connection");
      }
      
      try {
        // Standard TonConnect SDK connection attempt
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
        if (walletAny.universalUrl || walletAny.universal_url) {
          const universalLink = walletAny.universalUrl || walletAny.universal_url;
          console.log("Using universal link as fallback:", universalLink);
          window.location.href = universalLink;
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
        if (walletAny.universalUrl || walletAny.universal_url) {
          const universalLink = walletAny.universalUrl || walletAny.universal_url;
          console.log("Navigating to universal link:", universalLink);
          window.location.href = universalLink;
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
  return localStorage.getItem('isTelegramMiniApp') === 'true';
};
