
import { TonConnect } from "@tonconnect/sdk";

/**
 * Handles connection on mobile devices
 */
export const handleMobileConnection = async (
  wallet: TonConnect,
  tonkeeper: any
): Promise<void> => {
  console.log("Connecting on mobile device", tonkeeper);
  
  // Extract the important properties for debugging
  const walletInfo = {
    name: tonkeeper.name,
    hasUniversalUrl: !!tonkeeper.universalUrl,
    hasDeepLink: !!tonkeeper.deepLink,
    hasBridge: !!(tonkeeper.bridge && tonkeeper.bridge.length > 0)
  };
  console.log("Wallet details:", walletInfo);
  
  // For mobile, prioritize deep links
  if (tonkeeper.deepLink) {
    console.log("Using deep link for mobile:", tonkeeper.deepLink);
    
    try {
      // Direct navigation is more reliable on mobile
      window.location.href = tonkeeper.deepLink;
      console.log("Redirected to deep link");
      return; // Return early as we've navigated away
    } catch (e) {
      console.error("Error redirecting to deep link:", e);
      // Continue to try other methods
    }
  } 
  
  // If no deep link or it failed, try universal URL
  if (tonkeeper.universalUrl) {
    console.log("Using universal URL for mobile:", tonkeeper.universalUrl);
    
    try {
      // Direct navigation works better on mobile than window.open
      window.location.href = tonkeeper.universalUrl;
      console.log("Redirected to universal URL");
      return; // Return early as we've navigated away
    } catch (e) {
      console.error("Error redirecting to universal URL:", e);
      // Try window.open as fallback
      try {
        window.open(tonkeeper.universalUrl, '_blank');
        console.log("Opened universal URL in new window");
      } catch (e2) {
        console.error("Window.open fallback failed:", e2);
      }
    }
  } 
  
  // Last resort: try the standard connection method
  console.log("No deep link or universal URL, using standard connect");
  try {
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
    console.log("Standard connect method called");
  } catch (e) {
    console.error("Error in standard connect:", e);
    throw e; // Rethrow so caller knows connection failed
  }
};
