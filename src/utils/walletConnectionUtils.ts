import { TonConnect } from "@tonconnect/sdk";
import { detectMobileDevice, isTelegramMiniAppEnvironment } from "./environmentUtils";
import { clearConnectionTimeout, setupConnectionTimeout } from "./timeoutUtils";
import { 
  findTonkeeperWallet, 
  handleTelegramMiniAppConnection, 
  handleMobileConnection, 
  handleDesktopConnection 
} from "./wallet";

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
  
  // Double-check Telegram environment to be absolutely sure
  const forceTelegramCheck = window.Telegram && window.Telegram.WebApp;
  if (forceTelegramCheck && !isTelegramMiniApp) {
    console.log("Forcing Telegram Mini App environment detection based on window.Telegram.WebApp");
    isTelegramMiniApp = true;
  }
  
  // Double-check mobile environment for iOS/Android
  if (!isMobile && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    console.log("Forcing mobile environment detection based on user agent");
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
      console.error("No Tonkeeper wallet found in available wallets");
      setIsConnecting(false);
      return;
    }

    // Set up appropriate timeouts based on environment
    // Mobile connections need longer timeouts especially when app switching is involved
    const timeoutDuration = isTelegramMiniApp ? 180000 : // 3 minutes for Telegram
                           (isMobile ? 120000 : 30000);  // 2 minutes for mobile, 30s for desktop
    
    console.log(`Setting up connection timeout for ${timeoutDuration}ms`);
    const timeout = setupConnectionTimeout(timeoutDuration, () => {
      console.log("Connection attempt timed out");
      setIsConnecting(false);
    });
    
    setConnectionTimeout(timeout);

    // Log additional debugging information
    if (isTelegramMiniApp) {
      console.log("Telegram WebApp info:", 
        window.Telegram ? "Available" : "Not available",
        window.Telegram?.WebApp ? "WebApp available" : "WebApp not available"
      );
      
      if (window.Telegram?.WebApp) {
        console.log("Telegram platform:", window.Telegram.WebApp.platform || "unknown");
        console.log("Telegram version:", window.Telegram.WebApp.version || "unknown");
      }
    }

    // Determine and execute the appropriate connection method based on environment
    try {
      if (isTelegramMiniApp) {
        await handleTelegramMiniAppConnection(wallet, tonkeeper);
      } else if (isMobile) {
        await handleMobileConnection(wallet, tonkeeper);
      } else {
        await handleDesktopConnection(wallet, tonkeeper);
      }
      
      console.log("Connection attempt completed without errors");
    } catch (error) {
      console.error("Error during connection attempt:", error);
      // Don't immediately clear connecting state as connection might still complete
      // after navigation on mobile devices
    }
    
    return;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    setIsConnecting(false);
    clearConnectionTimeout(connectionTimeout);
    setConnectionTimeout(null);
    throw error;
  }
};
