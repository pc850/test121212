
import { TonConnect, isWalletInfoInjectable, WalletInfoRemote } from "@tonconnect/sdk";

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
