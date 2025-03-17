
/**
 * Finds the Tonkeeper wallet in the list of available wallets
 */
export const findTonkeeperWallet = (available: any[]) => {
  // Handle the case where available is undefined or empty
  if (!available || available.length === 0) {
    console.error("No wallets available");
    return null;
  }

  // Attempt to find Tonkeeper in available wallets
  const tonkeeper = available.find(w => 
    (w.name && w.name.toLowerCase().includes('tonkeeper')) || 
    (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
  );
  
  if (!tonkeeper) {
    console.error("Tonkeeper wallet not found in available wallets");
    
    // If in Telegram Mini App, provide a mockup Tonkeeper wallet for connection
    if (isTelegramMiniApp()) {
      console.log("Creating mockup Tonkeeper wallet for Telegram Mini App");
      return createMockTonkeeperWallet();
    }
  } else {
    console.log("Found Tonkeeper wallet:", tonkeeper);
  }
  
  return tonkeeper;
};

/**
 * Determines if we're in a Telegram Mini App environment
 */
const isTelegramMiniApp = (): boolean => {
  // Check various indicators of Telegram Mini App environment
  return !!(
    // Check if Telegram WebApp API is available
    (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) ||
    // Check localStorage flag (might have been set by bridge script)
    (typeof localStorage !== 'undefined' && localStorage.getItem('isTelegramMiniApp') === 'true') ||
    // Check for 'tgWebAppData' in URL (for testing)
    (typeof window !== 'undefined' && window.location.search.includes('tgWebAppData'))
  );
};

/**
 * Creates a mockup Tonkeeper wallet for Telegram Mini App environment
 * This is used when no wallets are found but we're in a Telegram Mini App
 */
const createMockTonkeeperWallet = () => {
  return {
    name: 'Tonkeeper',
    appName: 'Tonkeeper',
    universalUrl: 'https://app.tonkeeper.com/dapp/',
    deepLink: 'tonkeeper://',
    injected: false,
    bridge: []
  };
};
