import { TonConnect } from "@tonconnect/sdk";

/**
 * Handles connection from Telegram Mini App environment
 * Simplified to redirect directly to Tonkeeper browser with FIPT loaded
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
  
  // Construct the current URL to redirect back to after connecting
  const currentUrl = encodeURIComponent(window.location.href);
  
  // Direct Tonkeeper browser URL with our app already loaded and "connect wallet" parameter
  // This opens our app in Tonkeeper's built-in browser where wallet connection is seamless
  const tonkeeperBrowserUrl = 
    `https://app.tonkeeper.com/browse/${window.location.origin}?source=telegram-mini-app&t=${timestamp}&session=${sessionId}&auto_connect=true&redirect=${currentUrl}`;
  
  console.log(`[${sessionId}] Redirecting to Tonkeeper browser:`, tonkeeperBrowserUrl);
  
  // Try specialized Telegram bridge method first
  if (window.telegramBridge?.openTonkeeperWallet) {
    try {
      console.log(`[${sessionId}] Using telegramBridge.openTonkeeperWallet`);
      const success = window.telegramBridge.openTonkeeperWallet(tonkeeperBrowserUrl, { sessionId });
      if (success) {
        console.log(`[${sessionId}] Successfully opened Tonkeeper browser with telegramBridge`);
        return;
      }
    } catch (e) {
      console.error(`[${sessionId}] Error using telegramBridge:`, e);
      // Continue to standard methods
    }
  }
  
  // Check if we have Telegram's WebApp API
  if (tg && typeof tg.openLink === 'function') {
    console.log(`[${sessionId}] Using Telegram.WebApp.openLink API with Tonkeeper browser URL`);
    
    try {
      // Using try-catch because openLink might throw
      tg.openLink(tonkeeperBrowserUrl, { try_instant_view: false });
      console.log(`[${sessionId}] Successfully called Telegram.WebApp.openLink for Tonkeeper browser`);
      return;
    } catch (e) {
      console.error(`[${sessionId}] Error using Telegram.WebApp.openLink:`, e);
      // Continue to fallbacks
    }
  }
  
  // Fallback: try window.open
  try {
    console.log(`[${sessionId}] Using window.open for Tonkeeper browser URL`);
    const win = window.open(tonkeeperBrowserUrl, '_blank');
    if (win) {
      console.log(`[${sessionId}] Successfully opened with window.open`);
      return;
    }
  } catch (e) {
    console.error(`[${sessionId}] Error with window.open:`, e);
  }
  
  // Last resort: direct location change
  console.log(`[${sessionId}] Using window.location.href as last resort`);
  window.location.href = tonkeeperBrowserUrl;
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
