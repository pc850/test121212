
import { TonConnect } from "@tonconnect/sdk";
import { detectMobileDevice, isTelegramMiniAppEnvironment } from "./environmentUtils";
import { clearConnectionTimeout, setupConnectionTimeout } from "./timeoutUtils";
import { 
  findTonkeeperWallet, 
  handleTelegramMiniAppConnection, 
  handleMobileConnection, 
  handleDesktopConnection 
} from "./wallet";
// Import toast directly instead of using require()
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
  console.log("Available wallets:", available.map(w => w.name));
  
  // Force mobile detection for iOS/Android devices - this is critical
  const userAgent = navigator.userAgent || '';
  const forceMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  if (forceMobile && !isMobile) {
    console.log("⚠️ Forcing mobile environment detection based on user agent");
    isMobile = true;
  }
  
  // Double-check Telegram Mini App detection
  const forceTelegramCheck = window.Telegram && window.Telegram.WebApp;
  if (forceTelegramCheck && !isTelegramMiniApp) {
    console.log("Forcing Telegram Mini App environment detection based on window.Telegram.WebApp");
    isTelegramMiniApp = true;
  }

  // Clean up any existing timeout
  clearConnectionTimeout(connectionTimeout);

  try {
    // Set connecting state
    setIsConnecting(true);

    // Find Tonkeeper in available wallets
    const tonkeeper = findTonkeeperWallet(available);

    if (!tonkeeper) {
      console.error("No Tonkeeper wallet found in available wallets");
      setIsConnecting(false);
      throw new Error("Tonkeeper wallet not found");
    }

    // Enhanced logging of the wallet details for debugging
    console.log("Found Tonkeeper wallet:", {
      name: tonkeeper.name,
      universalUrl: tonkeeper.universalUrl ? "Available" : "Not available",
      deepLink: tonkeeper.deepLink ? "Available" : "Not available",
      bridgeCount: tonkeeper.bridge?.length || 0
    });

    // Set up a connection timeout - longer for mobile to account for app switching
    const timeoutDuration = isMobile ? 180000 : 30000; // 3 min for mobile, 30s for desktop
    
    console.log(`Setting up connection timeout for ${timeoutDuration}ms`);
    const timeout = setupConnectionTimeout(timeoutDuration, () => {
      console.log("Connection attempt timed out");
      setIsConnecting(false);
    });
    
    setConnectionTimeout(timeout);

    // Log user agent for debugging mobile issues
    console.log("User agent:", navigator.userAgent);
    
    // Determine and execute the appropriate connection method based on environment
    if (isTelegramMiniApp) {
      toast({
        title: "Opening Tonkeeper",
        description: "This will open Tonkeeper outside of Telegram. Please approve the connection request and return to this app.",
      });
      await handleTelegramMiniAppConnection(wallet, tonkeeper);
    } else if (isMobile) {
      toast({
        title: "Opening Tonkeeper",
        description: "Launching Tonkeeper app. If the app doesn't open automatically, you may need to install it.",
      });
      await handleMobileConnection(wallet, tonkeeper);
    } else {
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
