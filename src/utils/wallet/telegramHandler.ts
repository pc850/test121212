
import { TonConnect } from "@tonconnect/sdk";

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
