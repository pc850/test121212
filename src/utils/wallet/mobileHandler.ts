
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
  
  // For mobile connections, deep links work better than universal URLs in most cases
  if (tonkeeper.deepLink) {
    console.log("Using deep link for mobile:", tonkeeper.deepLink);
    
    try {
      // Add a timestamp to prevent caching issues
      const timestamp = Date.now();
      const deepLinkWithParam = `${tonkeeper.deepLink}?t=${timestamp}`;
      
      // Force a direct location change instead of window.open for better mobile handling
      window.location.href = deepLinkWithParam;
      console.log("Redirected to deep link with timestamp");
      return; // Return early as we've navigated away
    } catch (e) {
      console.error("Error redirecting to deep link:", e);
      // Continue to try other methods if deep link fails
    }
  } 
  
  // If no deep link or it failed, try universal URL
  if (tonkeeper.universalUrl) {
    console.log("Using universal URL for mobile:", tonkeeper.universalUrl);
    
    try {
      // Add a timestamp to prevent caching issues
      const timestamp = Date.now();
      const universalUrlWithParam = `${tonkeeper.universalUrl}${tonkeeper.universalUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
      
      // Force a direct location change for better mobile handling
      window.location.href = universalUrlWithParam;
      console.log("Redirected to universal URL with timestamp");
      return; // Return early as we've navigated away
    } catch (e) {
      console.error("Error redirecting to universal URL:", e);
      // Try window.open as fallback
      try {
        window.open(tonkeeper.universalUrl, '_blank', 'noreferrer');
        console.log("Opened universal URL in new window");
      } catch (e2) {
        console.error("Window.open fallback failed:", e2);
      }
    }
  } 
  
  // Last resort: try the standard connection method
  console.log("No deep link or universal URL worked, using standard connect");
  try {
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
    console.log("Standard connect method called");
  } catch (e) {
    console.error("Error in standard connect:", e);
    throw e; // Rethrow so caller knows connection failed
  }
};
