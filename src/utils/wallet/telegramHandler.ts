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
  
  // Try specialized Telegram bridge method first
  if (window.telegramBridge?.openTonkeeperWallet) {
    try {
      console.log(`[${sessionId}] Using telegramBridge.openTonkeeperWallet`);
      
      // First try the universal URL if available
      if (tonkeeper.universalUrl) {
        // Fix: Ensure valid URL format for universal URL
        const universalUrl = ensureValidUrl(tonkeeper.universalUrl);
        const success = window.telegramBridge.openTonkeeperWallet(universalUrl, { sessionId });
        if (success) {
          console.log(`[${sessionId}] Successfully opened Tonkeeper with telegramBridge`);
          return;
        }
      } 
      // Fallback to a direct Tonkeeper app URL if universal URL isn't available or fails
      else {
        const directUrl = "https://app.tonkeeper.com/dapp/?source=telegram-mini-app&t=" + timestamp + "&session=" + sessionId;
        const success = window.telegramBridge.openTonkeeperWallet(directUrl, { sessionId });
        if (success) {
          console.log(`[${sessionId}] Successfully opened direct Tonkeeper URL with telegramBridge`);
          return;
        }
      }
      
      // Fall back to deep link if universal URL didn't work
      if (tonkeeper.deepLink) {
        // Fix: Ensure valid URL format for deep link
        const deepLink = ensureValidUrl(tonkeeper.deepLink);
        const success = window.telegramBridge.openTonkeeperWallet(deepLink, { sessionId });
        if (success) {
          console.log(`[${sessionId}] Successfully opened Tonkeeper with telegramBridge (deepLink)`);
          return;
        }
      }
    } catch (e) {
      console.error(`[${sessionId}] Error using telegramBridge:`, e);
      // Continue to standard methods
    }
  }
  
  // If bridge method failed, use a direct Tonkeeper URL
  const directTonkeeperUrl = "https://app.tonkeeper.com/dapp/?source=telegram-mini-app&t=" + timestamp + "&session=" + sessionId;
  
  // Check if we have Telegram's WebApp API
  if (tg && typeof tg.openLink === 'function') {
    console.log(`[${sessionId}] Using Telegram.WebApp.openLink API with direct Tonkeeper URL`);
    
    try {
      // Using try-catch because openLink might throw
      tg.openLink(directTonkeeperUrl, { try_instant_view: false });
      console.log(`[${sessionId}] Successfully called Telegram.WebApp.openLink for direct URL`);
      return;
    } catch (e) {
      console.error(`[${sessionId}] Error using Telegram.WebApp.openLink:`, e);
      // Continue to fallbacks
    }
  }
  
  // Fallback: try window.open
  try {
    console.log(`[${sessionId}] Using window.open for direct Tonkeeper URL`);
    const win = window.open(directTonkeeperUrl, '_blank');
    if (win) {
      console.log(`[${sessionId}] Successfully opened with window.open`);
      return;
    }
  } catch (e) {
    console.error(`[${sessionId}] Error with window.open:`, e);
  }
  
  // Last resort: direct location change
  console.log(`[${sessionId}] Using window.location.href as last resort`);
  window.location.href = directTonkeeperUrl;
  return;
};

/**
 * Ensures the URL is properly formatted for mobile/Telegram redirects
 */
function ensureValidUrl(url: string): string {
  // Check if URL starts with a scheme/protocol
  if (!url.includes('://') && !url.startsWith('http')) {
    // For tonkeeper-specific URLs
    if (url.startsWith('tonkeeper:')) {
      return url; // Keep specialized protocol as is
    }
    
    // For ton:// links
    if (url.startsWith('ton:')) {
      return url; // Keep TON protocol as is
    }
    
    // For universal links that might be missing the https:// prefix
    if (url.includes('.') && !url.startsWith('http')) {
      return `https://${url}`;
    }
  }
  
  return url;
}
