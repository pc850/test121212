
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
  
  // Add unique ID to prevent caching and improve tracking
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  
  // Try deep link first - this is most reliable on mobile
  if (tonkeeper.deepLink) {
    console.log("Using deep link for mobile:", tonkeeper.deepLink);
    
    try {
      // Format URL with universal app link format
      let deepLinkUrl = tonkeeper.deepLink;
      
      // Add connection parameters & unique ID to prevent caching
      const paramChar = deepLinkUrl.includes('?') ? '&' : '?';
      deepLinkUrl = `${deepLinkUrl}${paramChar}t=${uniqueId}`;
      
      console.log("Final deep link URL:", deepLinkUrl);
      
      // Force direct navigation for best mobile compatibility
      window.location.href = deepLinkUrl;
      console.log("Redirected to Tonkeeper deep link");
      
      // Return early as we're navigating away
      return;
    } catch (e) {
      console.error("Failed to redirect to deep link:", e);
    }
  }
  
  // Try universal URL as fallback if deep link fails
  if (tonkeeper.universalUrl) {
    console.log("Using universal URL as fallback:", tonkeeper.universalUrl);
    
    try {
      // Add unique ID to prevent caching
      const paramChar = tonkeeper.universalUrl.includes('?') ? '&' : '?';
      const universalUrl = `${tonkeeper.universalUrl}${paramChar}t=${uniqueId}`;
      
      console.log("Final universal URL:", universalUrl);
      
      // Force direct navigation
      window.location.href = universalUrl;
      console.log("Redirected to universal URL");
      
      // Return early as we're navigating away
      return;
    } catch (e) {
      console.error("Failed to redirect to universal URL:", e);
      
      // One more attempt with window.open as last resort
      try {
        window.open(tonkeeper.universalUrl, '_blank');
        console.log("Opened universal URL in new window");
        return;
      } catch (e2) {
        console.error("Window.open fallback also failed:", e2);
      }
    }
  }
  
  // Last resort: try standard connect method if all else fails
  console.log("All direct connection methods failed, attempting standard connect");
  try {
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
    console.log("Standard connect method executed");
  } catch (e) {
    console.error("Standard connect also failed:", e);
    throw e; // Rethrow so caller knows connection failed
  }
};
