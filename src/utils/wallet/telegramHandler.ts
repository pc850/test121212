
import { TonConnect } from "@tonconnect/sdk";

/**
 * Handles connection from Telegram Mini App environment
 */
export const handleTelegramMiniAppConnection = async (
  wallet: TonConnect,
  tonkeeper: any
): Promise<void> => {
  console.log("Connecting from Telegram Mini App", tonkeeper);
  
  // Check for Telegram WebApp environment
  const tg = window.Telegram?.WebApp;
  const useTelegramWebApp = tg && typeof tg.openLink === 'function';
  
  console.log("Telegram WebApp available:", useTelegramWebApp ? "Yes" : "No");
  
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  
  // Try deep link first as it often works better with Telegram
  if (tonkeeper.deepLink) {
    console.log("Using deep link for Telegram Mini App:", tonkeeper.deepLink);
    
    try {
      const deepLinkWithParam = `${tonkeeper.deepLink}?t=${timestamp}`;
      
      if (useTelegramWebApp) {
        console.log("Opening with Telegram.WebApp.openLink");
        // Use Telegram's API to open external links - needs try/catch as it might throw
        tg.openLink(deepLinkWithParam, { try_instant_view: false });
        console.log("Opened deep link with Telegram WebApp API");
      } else {
        // Direct navigation fallback for older Telegram versions
        console.log("Telegram WebApp not available, using direct navigation");
        window.location.href = deepLinkWithParam;
        console.log("Redirected to deep link");
      }
      return; // Return early as we've navigated away
    } catch (e) {
      console.error("Error opening deep link from Telegram:", e);
      // Continue to try other methods
    }
  }
  
  // If deep link failed or isn't available, try universal URL
  if (tonkeeper.universalUrl) {
    console.log("Using universal URL for Telegram Mini App:", tonkeeper.universalUrl);
    
    try {
      // Add a timestamp to prevent caching
      const universalUrlWithParam = `${tonkeeper.universalUrl}${tonkeeper.universalUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
      
      if (useTelegramWebApp) {
        console.log("Opening with Telegram.WebApp.openLink");
        // Use Telegram's API to open external links
        tg.openLink(universalUrlWithParam, { try_instant_view: false });
        console.log("Opened universal URL with Telegram WebApp API");
      } else {
        // Direct navigation fallback
        console.log("Telegram WebApp not available, using direct navigation");
        window.location.href = universalUrlWithParam;
        console.log("Redirected to universal URL");
      }
      return; // Return early as we've navigated away
    } catch (e) {
      console.error("Error opening universal URL from Telegram:", e);
      
      // Try window.open as fallback
      try {
        window.open(tonkeeper.universalUrl, '_blank', 'noreferrer');
        console.log("Opened universal URL in new window");
      } catch (e2) {
        console.error("Window.open fallback failed:", e2);
      }
    }
  }
  
  // Last resort: try standard connection
  console.log("Direct navigation methods failed, trying standard connect");
  try {
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
    console.log("Standard connect method called");
  } catch (e) {
    console.error("Error in standard connect from Telegram:", e);
    throw e;
  }
};
