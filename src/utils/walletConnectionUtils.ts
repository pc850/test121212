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
      setIsConnecting(false);
      return;
    }

    // Set a timeout to reset the connecting state if it takes too long
    const timeout = setupConnectionTimeout(30000, () => {
      setIsConnecting(false);
    });
    
    setConnectionTimeout(timeout);

    // Determine connection method based on environment
    if (isTelegramMiniApp) {
      await handleTelegramMiniAppConnection(wallet, tonkeeper);
    } else if (isMobile) {
      await handleMobileConnection(wallet, tonkeeper);
    } else {
      await handleDesktopConnection(wallet, tonkeeper);
    }

    console.log("Connection attempt completed without errors");
    return;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    setIsConnecting(false);
    throw error;
  }
};
