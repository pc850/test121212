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
  
  // On iOS, try the universal URL first as it's more reliable
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // For Tonkeeper Browser specifically
  const isTonkeeperBrowser = /Tonkeeper/i.test(navigator.userAgent);
  if (isTonkeeperBrowser) {
    console.log("Detected Tonkeeper browser - using direct connection");
    try {
      await wallet.connect({ jsBridgeKey: "tonkeeper" });
      console.log("Connected via direct bridge in Tonkeeper browser");
      return;
    } catch (e) {
      console.error("Failed to use direct connection in Tonkeeper browser:", e);
      // Fall through to other methods
    }
  }
  
  if (isIOS && tonkeeper.universalUrl) {
    console.log("iOS detected - using universal URL first");
    try {
      // Format universal URL with unique parameter
      const paramChar = tonkeeper.universalUrl.includes('?') ? '&' : '?';
      const universalUrl = `${tonkeeper.universalUrl}${paramChar}t=${uniqueId}`;
      
      console.log("Opening Tonkeeper with iOS universal URL:", universalUrl);
      
      // iOS needs direct window.location for best results
      window.location.href = universalUrl;
      return;
    } catch (e) {
      console.error("Failed to open iOS universal URL:", e);
      // Fall through to other methods
    }
  }
  
  // For Android or if iOS universal URL fails, try deep link
  if (tonkeeper.deepLink) {
    console.log("Using direct deep link for mobile connection");
    
    try {
      // Format deep link URL with unique parameter to prevent caching
      let deepLinkUrl = tonkeeper.deepLink;
      
      // Add connection parameters & unique ID
      const paramChar = deepLinkUrl.includes('?') ? '&' : '?';
      deepLinkUrl = `${deepLinkUrl}${paramChar}t=${uniqueId}`;
      
      console.log("Opening deep link URL:", deepLinkUrl);
      
      // Use direct location change for most reliable deep linking
      window.location.href = deepLinkUrl;
      console.log("Redirected to Tonkeeper deep link");
      
      // Return early as we're navigating away
      return;
    } catch (e) {
      console.error("Failed to redirect to deep link:", e);
    }
  }
  
  // Alternative approach - generate app store links if all else fails
  if (isIOS) {
    console.log("All methods failed - redirecting to App Store");
    window.location.href = "https://apps.apple.com/app/tonkeeper/id1587312458";
    return;
  } else if (/android/i.test(navigator.userAgent)) {
    console.log("All methods failed - redirecting to Play Store");
    window.location.href = "https://play.google.com/store/apps/details?id=com.tonkeeper";
    return;
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
