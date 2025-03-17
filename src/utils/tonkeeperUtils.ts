
import { TonConnect, isWalletInfoInjectable, WalletInfoRemote } from "@tonconnect/sdk";

/**
 * Finds the Tonkeeper wallet in the list of available wallets
 */
export const findTonkeeperWallet = (available: any[]) => {
  const tonkeeper = available.find(w => 
    w.name.toLowerCase().includes('tonkeeper') || 
    (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
  );
  
  if (!tonkeeper) {
    console.error("Tonkeeper wallet not found in available wallets");
  } else {
    console.log("Found Tonkeeper wallet:", tonkeeper);
  }
  
  return tonkeeper;
};

/**
 * Handles connection for Telegram Mini App environment
 */
export const handleTelegramMiniAppConnection = async (
  wallet: TonConnect,
  tonkeeper: any
): Promise<void> => {
  console.log("Connecting using Telegram Mini App approach");
  
  // For Telegram Mini App, we need to use universal URL to open Tonkeeper
  if (tonkeeper.universalUrl) {
    console.log("Using universal URL:", tonkeeper.universalUrl);
    
    // Open the universal URL in a new tab/window
    window.open(tonkeeper.universalUrl, '_blank');
    
    // Attempt to use the connect method as well as a fallback
    try {
      await wallet.connect({
        universalLink: tonkeeper.universalUrl,
        bridgeUrl: tonkeeper.bridge?.[0]?.url
      });
      console.log("Connect method called successfully");
    } catch (e) {
      console.error("Error in wallet.connect method:", e);
    }
  } else {
    console.log("No universal URL available, trying standard connect");
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
  }
};

/**
 * Handles connection on mobile devices
 */
export const handleMobileConnection = async (
  wallet: TonConnect,
  tonkeeper: any
): Promise<void> => {
  console.log("Connecting on mobile device", tonkeeper);
  
  // Mobile connections need special handling
  // Extract the important properties for debugging
  const walletInfo = {
    name: tonkeeper.name,
    hasUniversalUrl: !!tonkeeper.universalUrl,
    hasDeepLink: !!tonkeeper.deepLink,
    hasBridge: !!(tonkeeper.bridge && tonkeeper.bridge.length > 0)
  };
  console.log("Wallet details:", walletInfo);
  
  // For Android/iOS deep links work better than universal URLs in many cases
  if (tonkeeper.deepLink) {
    console.log("Using deep link for mobile:", tonkeeper.deepLink);
    
    // For mobile, we need to directly change the window location
    // to trigger the app to open
    try {
      window.location.href = tonkeeper.deepLink;
      console.log("Redirected to deep link");
      
      // As a fallback, also call connect (though the page may have already navigated away)
      setTimeout(() => {
        try {
          wallet.connect({
            jsBridgeKey: "tonkeeper"
          }).catch(e => console.error("Error in delayed connect:", e));
        } catch (e) {
          console.error("Error setting up delayed connect:", e);
        }
      }, 100);
    } catch (e) {
      console.error("Error redirecting to deep link:", e);
      
      // If deep link redirection fails, try universal URL as fallback
      if (tonkeeper.universalUrl) {
        console.log("Falling back to universal URL");
        window.location.href = tonkeeper.universalUrl;
      }
    }
  } 
  // If no deep link but has universal URL
  else if (tonkeeper.universalUrl) {
    console.log("Using universal URL for mobile:", tonkeeper.universalUrl);
    
    try {
      // Direct navigation works better on mobile than window.open
      window.location.href = tonkeeper.universalUrl;
      console.log("Redirected to universal URL");
      
      // Also try the connect method as a fallback
      setTimeout(() => {
        try {
          wallet.connect({
            universalLink: tonkeeper.universalUrl,
            bridgeUrl: tonkeeper.bridge?.[0]?.url
          }).catch(e => console.error("Error in delayed connect:", e));
        } catch (e) {
          console.error("Error setting up delayed connect:", e);
        }
      }, 100);
    } catch (e) {
      console.error("Error redirecting to universal URL:", e);
    }
  } 
  // Last resort: try the standard connection method
  else {
    console.log("No deep link or universal URL, using standard connect");
    try {
      await wallet.connect({ jsBridgeKey: "tonkeeper" });
      console.log("Standard connect method called");
    } catch (e) {
      console.error("Error in standard connect:", e);
    }
  }
};

/**
 * Handles connection on desktop browsers
 */
export const handleDesktopConnection = async (
  wallet: TonConnect,
  tonkeeper: any
): Promise<void> => {
  console.log("Connecting on desktop browser");
  
  if (isWalletInfoInjectable(tonkeeper)) {
    console.log("Using injectable wallet connection");
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
  } else if ((tonkeeper as WalletInfoRemote).universalLink) {
    console.log("Using universal link for desktop:", (tonkeeper as WalletInfoRemote).universalLink);
    const link = (tonkeeper as WalletInfoRemote).universalLink;
    window.open(link, '_blank');
    
    // Also try the connect method
    try {
      await wallet.connect({
        universalLink: link,
        bridgeUrl: (tonkeeper as WalletInfoRemote).bridgeUrl
      });
      console.log("Desktop connect method called successfully");
    } catch (e) {
      console.error("Error in desktop wallet.connect method:", e);
    }
  } else {
    console.log("Using standard connect method");
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
  }
};

