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
  console.log("Connecting on mobile device");
  
  // For mobile, try using universal URL first if available
  if (tonkeeper.universalUrl) {
    console.log("Using universal URL for mobile:", tonkeeper.universalUrl);
    window.location.href = tonkeeper.universalUrl;
    
    // As a fallback, also try the connect method
    try {
      await wallet.connect({
        universalLink: tonkeeper.universalUrl,
        bridgeUrl: tonkeeper.bridge?.[0]?.url
      });
      console.log("Mobile connect method called successfully");
    } catch (e) {
      console.error("Error in mobile wallet.connect method:", e);
    }
  } else if (tonkeeper.deepLink) {
    console.log("Using deep link:", tonkeeper.deepLink);
    window.location.href = tonkeeper.deepLink;
  } else {
    console.log("No deep link or universal URL, using standard connect");
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
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
