import { TonConnect } from "@tonconnect/sdk";
import { detectMobileDevice, isTelegramMiniAppEnvironment } from "./environmentUtils";
import { clearConnectionTimeout, setupConnectionTimeout } from "./timeoutUtils";
import { 
  findTonkeeperWallet, 
  handleTelegramMiniAppConnection, 
  handleMobileConnection, 
  handleDesktopConnection 
} from "./wallet";
import { toast as showToast } from "@/hooks/use-toast";

export { 
  detectMobileDevice, 
  isTelegramMiniAppEnvironment 
} from "./environmentUtils";

/**
 * Connects to Tonkeeper wallet based on the current environment
 */
export const connectToTonkeeper = async (
  wallet: TonConnect,
  available: any[],
  isMobile: boolean,
  isTelegramMiniApp: boolean,
  setIsConnecting: (connecting: boolean) => void,
  setConnectionTimeout: (timeout: ReturnType<typeof setTimeout> | null) => void,
  connectionTimeout: ReturnType<typeof setTimeout> | null
) => {
  console.log("Starting wallet connection attempt...");
  console.log("Environment:", { isMobile, isTelegramMiniApp });
  console.log("Available wallets:", available ? available.map(w => w.name) : 'No wallets found');
  
  // Check if running inside Tonkeeper browser
  const isTonkeeperBrowser = /Tonkeeper/i.test(navigator.userAgent);
  if (isTonkeeperBrowser) {
    console.log("★★★ Running inside Tonkeeper browser! Using direct connection method");
    isMobile = true; // Force mobile mode
  }
  
  // Force Telegram Mini App detection
  const forceTelegramCheck = window.Telegram && window.Telegram.WebApp;
  if (forceTelegramCheck && !isTelegramMiniApp) {
    console.log("Forcing Telegram Mini App environment detection based on window.Telegram.WebApp");
    isTelegramMiniApp = true;
    // Also set in localStorage for persistence
    localStorage.setItem('isTelegramMiniApp', 'true');
    localStorage.setItem('tonconnect_in_telegram', 'true');
  }
  
  // Force mobile detection for iOS/Android devices - this is critical
  const userAgent = navigator.userAgent || '';
  const forceMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  if ((forceMobile || isTelegramMiniApp || isTonkeeperBrowser) && !isMobile) {
    console.log("⚠️ Forcing mobile environment detection based on user agent or Telegram");
    isMobile = true;
  }
  
  // Clean up any existing timeout
  clearConnectionTimeout(connectionTimeout);

  try {
    // Set connecting state
    setIsConnecting(true);

    // Find Tonkeeper in available wallets
    const tonkeeper = findTonkeeperWallet(available);

    if (!tonkeeper) {
      // If explicitly in Telegram Mini App environment, use a hardcoded Tonkeeper URL
      if (isTelegramMiniApp) {
        console.log("No Tonkeeper wallet found, but in Telegram Mini App. Using direct approach");
        const url = "https://app.tonkeeper.com/dapp/?source=telegram-mini-app&t=" + Date.now();
        
        if (window.telegramBridge?.openTonkeeperWallet) {
          window.telegramBridge.openTonkeeperWallet(url);
        } else if (window.Telegram?.WebApp?.openLink) {
          window.Telegram.WebApp.openLink(url, { try_instant_view: false });
        } else {
          window.open(url, "_blank");
        }
        
        // We don't return immediately - instead we set a timeout and wait for possible connection
        const timeout = setupConnectionTimeout(180000, () => {
          console.log("Connection attempt timed out");
          setIsConnecting(false);
        });
        setConnectionTimeout(timeout);
        return;
      }
      
      console.error("No Tonkeeper wallet found in available wallets");
      setIsConnecting(false);
      throw new Error("Tonkeeper wallet not found");
    }

    // Enhanced logging of the wallet details for debugging
    console.log("Found Tonkeeper wallet:", {
      name: tonkeeper.name,
      universalUrl: tonkeeper.universalUrl ? tonkeeper.universalUrl : "Not available",
      deepLink: tonkeeper.deepLink ? tonkeeper.deepLink : "Not available",
      bridgeCount: tonkeeper.bridge?.length || 0,
      injected: tonkeeper.injected
    });

    // Set up a connection timeout - longer for mobile to account for app switching
    const timeoutDuration = isMobile || isTelegramMiniApp ? 180000 : 30000; // 3 min for mobile/telegram, 30s for desktop
    
    console.log(`Setting up connection timeout for ${timeoutDuration}ms`);
    const timeout = setupConnectionTimeout(timeoutDuration, () => {
      console.log("Connection attempt timed out");
      setIsConnecting(false);
    });
    
    setConnectionTimeout(timeout);

    // Log user agent for debugging mobile issues
    console.log("User agent:", navigator.userAgent);
    
    // Special handling for Tonkeeper browser
    if (isTonkeeperBrowser) {
      console.log("Using Tonkeeper browser connection method");
      try {
        await wallet.connect({ jsBridgeKey: "tonkeeper" });
        console.log("Connected via Tonkeeper browser");
        return;
      } catch (e) {
        console.error("Error connecting in Tonkeeper browser:", e);
        // Fall through to mobile method
      }
    }
    
    // Determine and execute the appropriate connection method based on environment
    if (isTelegramMiniApp) {
      console.log("Using Telegram Mini App connection method");
      toast({
        title: "Opening Tonkeeper",
        description: "This will open Tonkeeper outside of Telegram. Please approve the connection request and return to this app.",
      });
      await handleTelegramMiniAppConnection(wallet, tonkeeper);
    } else if (isMobile) {
      console.log("Using mobile connection method");
      toast({
        title: "Opening Tonkeeper",
        description: "Launching Tonkeeper app. If the app doesn't open automatically, you may need to install it.",
      });
      await handleMobileConnection(wallet, tonkeeper);
    } else {
      console.log("Using desktop connection method");
      toast({
        title: "Connecting to Tonkeeper",
        description: "Please check your browser extension or desktop app to approve the connection.",
      });
      await handleDesktopConnection(wallet, tonkeeper);
    }
    
    console.log("Connection initiation completed");
    return;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    setIsConnecting(false);
    clearConnectionTimeout(connectionTimeout);
    setConnectionTimeout(null);
    
    toast({
      title: "Connection Error",
      description: "Failed to connect to Tonkeeper. Please ensure the app is installed and try again.",
      variant: "destructive"
    });
    
    throw error;
  }
};

// Helper for showing toast messages without using require()
const toast = (options: { title: string; description: string; variant?: "default" | "destructive" }) => {
  // Use the imported toast function directly
  showToast(options);
};
