
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
  
  // Generate a unique session ID for this connection attempt
  const sessionId = Math.random().toString(36).substring(2, 15);
  console.log(`Telegram connection attempt ${sessionId} started`);
  
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  
  // Check if we have universal URL (preferred for Telegram)
  if (tonkeeper.universalUrl) {
    console.log(`[${sessionId}] Using universal URL:`, tonkeeper.universalUrl);
    
    try {
      // Add params to track and prevent caching
      const params = new URLSearchParams({
        t: timestamp.toString(),
        session: sessionId,
        source: 'telegram-mini-app'
      });
      
      const universalUrlWithParams = `${tonkeeper.universalUrl}${
        tonkeeper.universalUrl.includes('?') ? '&' : '?'
      }${params.toString()}`;
      
      console.log(`[${sessionId}] Opening URL with params:`, universalUrlWithParams);
      
      if (tg && typeof tg.openLink === 'function') {
        console.log(`[${sessionId}] Using Telegram.WebApp.openLink API`);
        
        // Using try-catch because openLink might throw
        try {
          // In Telegram, use their API to open external links
          tg.openLink(universalUrlWithParams, { try_instant_view: false });
          console.log(`[${sessionId}] Successfully called Telegram.WebApp.openLink`);
          return;
        } catch (e) {
          console.error(`[${sessionId}] Error using Telegram.WebApp.openLink:`, e);
          // Continue to fallbacks
        }
      } else {
        console.log(`[${sessionId}] Telegram WebApp.openLink not available, using window.open`);
      }
      
      // Fallback: try window.open
      try {
        const win = window.open(universalUrlWithParams, '_blank');
        console.log(`[${sessionId}] Opened with window.open, success:`, !!win);
        if (win) return;
      } catch (e) {
        console.error(`[${sessionId}] Error with window.open fallback:`, e);
      }
      
      // Last resort: direct location change
      console.log(`[${sessionId}] Using window.location.href as last resort`);
      window.location.href = universalUrlWithParams;
      return;
    } catch (e) {
      console.error(`[${sessionId}] Universal URL handling failed:`, e);
      // Continue to next method
    }
  }
  
  // If universal URL failed or isn't available, try deep link
  if (tonkeeper.deepLink) {
    console.log(`[${sessionId}] Trying deep link:`, tonkeeper.deepLink);
    
    try {
      // Add params to prevent caching
      const deepLinkWithParams = `${tonkeeper.deepLink}?t=${timestamp}&session=${sessionId}&source=telegram-mini-app`;
      
      console.log(`[${sessionId}] Opening deep link with params:`, deepLinkWithParams);
      
      if (tg && typeof tg.openLink === 'function') {
        console.log(`[${sessionId}] Using Telegram.WebApp.openLink for deep link`);
        
        try {
          tg.openLink(deepLinkWithParams, { try_instant_view: false });
          console.log(`[${sessionId}] Successfully called Telegram.WebApp.openLink for deep link`);
          return;
        } catch (e) {
          console.error(`[${sessionId}] Error using Telegram.WebApp.openLink for deep link:`, e);
        }
      }
      
      // Try window.open for deep link
      try {
        const win = window.open(deepLinkWithParams, '_blank');
        console.log(`[${sessionId}] Opened deep link with window.open, success:`, !!win);
        if (win) return;
      } catch (e) {
        console.error(`[${sessionId}] Error with window.open for deep link:`, e);
      }
      
      // Direct navigation as last resort
      console.log(`[${sessionId}] Using window.location.href for deep link`);
      window.location.href = deepLinkWithParams;
      return;
    } catch (e) {
      console.error(`[${sessionId}] Deep link handling failed:`, e);
    }
  }
  
  // Last resort: try standard connection
  console.log(`[${sessionId}] All redirection methods failed, trying standard connect`);
  try {
    await wallet.connect({ jsBridgeKey: "tonkeeper" });
    console.log(`[${sessionId}] Standard connect method called`);
  } catch (e) {
    console.error(`[${sessionId}] Error in standard connect:`, e);
    throw e;
  }
};
