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
  console.log("Tonkeeper details in Mini App:", JSON.stringify(tonkeeper, null, 2));
  
  // Extract the most reliable URL to use
  let tonkeeperUrl = '';
  
  // For Telegram, we prioritize direct wallet URLs over the TonConnect protocol
  if (tonkeeper.universalUrl) {
    tonkeeperUrl = tonkeeper.universalUrl;
    console.log("Using universal URL:", tonkeeperUrl);
  } else if (tonkeeper.deepLink) {
    tonkeeperUrl = tonkeeper.deepLink;
    console.log("Using deep link:", tonkeeperUrl);
  } else {
    console.log("No direct URLs found, will try standard connection");
  }
  
  // Direct approach for Telegram WebApp
  if (tonkeeperUrl && window.Telegram?.WebApp) {
    console.log("Using Telegram WebApp to open Tonkeeper");
    
    // Force app to open externally with correct parameters
    try {
      // Add a timestamp to prevent caching
      const timestampedUrl = tonkeeperUrl.includes('?') 
        ? `${tonkeeperUrl}&_t=${Date.now()}` 
        : `${tonkeeperUrl}?_t=${Date.now()}`;
      
      // Tell Telegram explicitly this should open externally
      window.Telegram.WebApp.openLink(timestampedUrl, {
        try_instant_view: false
      });
      
      console.log("Opened link via Telegram.WebApp.openLink");
      return;
    } catch (e) {
      console.error("Error using Telegram.WebApp.openLink:", e);
    }
  }
  
  // If WebApp API failed or isn't available, try direct navigation
  if (tonkeeperUrl) {
    console.log("Falling back to direct navigation with URL:", tonkeeperUrl);
    
    try {
      // Add timestamp to prevent caching
      const timestampedUrl = tonkeeperUrl.includes('?') 
        ? `${tonkeeperUrl}&_t=${Date.now()}` 
        : `${tonkeeperUrl}?_t=${Date.now()}`;
      
      // Force window location change
      window.location.href = timestampedUrl;
      console.log("Redirected directly");
      return;
    } catch (e) {
      console.error("Direct navigation failed:", e);
    }
  }
  
  // Last resort: try standard connect method
  console.log("Trying standard connect as last resort");
  try {
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
    console.log("Standard connect method called");
  } catch (e) {
    console.error("Error in standard connect:", e);
    throw e;
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
    try {
      await wallet.connect({ jsBridgeKey: "tonkeeper" });
      console.log("Connected to injectable wallet");
    } catch (e) {
      console.error("Error connecting to injectable wallet:", e);
      throw e;
    }
  } else if ((tonkeeper as WalletInfoRemote).universalLink) {
    console.log("Using universal link for desktop:", (tonkeeper as WalletInfoRemote).universalLink);
    const link = (tonkeeper as WalletInfoRemote).universalLink;
    
    // First try opening in a new tab
    try {
      window.open(link, '_blank');
      console.log("Opened universal link in new tab");
      
      // Also try the connect method in parallel
      try {
        await wallet.connect({
          universalLink: link,
          bridgeUrl: (tonkeeper as WalletInfoRemote).bridgeUrl
        });
        console.log("Desktop connect method called successfully");
      } catch (e) {
        console.error("Error in desktop wallet.connect method:", e);
        // Don't throw here as we've already opened the window
      }
    } catch (e) {
      console.error("Error opening universal link:", e);
      // If window.open fails, try direct connect as fallback
      try {
        await wallet.connect({
          universalLink: link,
          bridgeUrl: (tonkeeper as WalletInfoRemote).bridgeUrl
        });
        console.log("Direct connect fallback called");
      } catch (e2) {
        console.error("Direct connect fallback failed:", e2);
        throw e2;
      }
    }
  } else {
    console.log("Using standard connect method");
    try {
      await wallet.connect({ jsBridgeKey: "tonkeeper" });
      console.log("Standard connect called");
    } catch (e) {
      console.error("Error in standard connect:", e);
      throw e;
    }
  }
};
