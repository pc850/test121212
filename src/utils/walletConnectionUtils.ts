
import { TonConnect } from "@tonconnect/sdk";
import { detectMobileDevice, isTelegramMiniAppEnvironment } from "./environmentUtils";
import { clearConnectionTimeout, setupConnectionTimeout } from "./timeoutUtils";
import { 
  findTonkeeperWallet, 
  handleTelegramMiniAppConnection, 
  handleMobileConnection, 
  handleDesktopConnection 
} from "./tonkeeperUtils";

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

    // Set a timeout to reset the connecting state if it takes too long
    // Use a longer timeout for Telegram Mini App as it involves app switching
    const timeoutDuration = isTelegramMiniApp ? 60000 : (isMobile ? 45000 : 30000);
    const timeout = setupConnectionTimeout(timeoutDuration, () => {
      console.log("Connection attempt timed out");
      setIsConnecting(false);
    });
    
    setConnectionTimeout(timeout);

    // Log additional information for debugging
    if (isTelegramMiniApp) {
      console.log("Telegram WebApp info:", 
        window.Telegram ? "Available" : "Not available",
        window.Telegram?.WebApp ? "WebApp available" : "WebApp not available"
      );
      
      if (window.Telegram?.WebApp) {
        console.log("Telegram platform:", window.Telegram.WebApp.platform || "unknown");
      }
    }

    // Determine connection method based on environment
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
      // Don't clear connecting state here since we might have navigated away
      // on mobile/telegram and the connection might still complete
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
