
/**
 * Utilities for detecting environment (mobile, Telegram Mini App, etc.)
 */

/**
 * Detects if the current device is a mobile device based on user agent
 */
export const detectMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Force mobile detection for common mobile devices - this is the most reliable check
  const userAgent = navigator.userAgent || '';
  if (/iPhone|iPad|iPod|Android/i.test(userAgent)) {
    console.log("Mobile device detected via user agent");
    return true;
  }
  
  // Check for touch capabilities
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check user agent for common mobile strings
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|mobi/i;
  
  // Check screen size
  const smallScreen = window.innerWidth < 768;
  
  // If at least two conditions match, it's likely a mobile device
  const mobileConditions = [
    hasTouch,
    mobileRegex.test(userAgent.toLowerCase()),
    smallScreen
  ];
  
  // Count how many conditions match
  const matchCount = mobileConditions.filter(Boolean).length;
  
  const isMobile = matchCount >= 2;
  if (isMobile) {
    console.log("Mobile device detected via combined heuristics");
  }
  
  return isMobile;
};

/**
 * Detects if the app is running in Telegram Mini App environment
 */
export const isTelegramMiniAppEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Most reliable check: Telegram WebApp object exists
  const hasTelegramWebApp = !!(window.Telegram && window.Telegram.WebApp);
  
  // Secondary check: URL parameters for Telegram-specific parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hasTelegramParams = urlParams.has('tgWebAppData') || 
                           urlParams.has('tgWebAppStartParam') || 
                           urlParams.has('tgWebAppPlatform');
  
  // Third check: explicit flags in localStorage (set by our webapp bridge)
  const storedFlag = localStorage.getItem('isTelegramMiniApp') === 'true';
  
  // Fourth check: Telegram web app script in document
  const hasTelegramScript = !!document.querySelector('script[src*="telegram-web-app.js"]');
  
  // Manual override via URL for testing
  const forceTelegram = urlParams.get('forceTelegram') === 'true';
  
  const isTelegram = hasTelegramWebApp || hasTelegramParams || storedFlag || hasTelegramScript || forceTelegram;
  
  if (isTelegram) {
    console.log("Telegram Mini App environment detected", {
      hasTelegramWebApp,
      hasTelegramParams,
      storedFlag,
      hasTelegramScript,
      forceTelegram
    });
    
    // If we detect Telegram, ensure our local storage flag is set for future checks
    localStorage.setItem('isTelegramMiniApp', 'true');
    
    // Set flag specifically for TonConnect to know we're in Telegram
    localStorage.setItem('tonconnect_in_telegram', 'true');
  }
  
  return isTelegram;
};

/**
 * Gets detailed information about the current environment
 */
export const getEnvironmentInfo = () => {
  const isMobile = detectMobileDevice();
  const isTgMiniApp = isTelegramMiniAppEnvironment();
  
  return {
    isMobile,
    isTelegramMiniApp: isTgMiniApp,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    platform: typeof window !== 'undefined' ? navigator.platform : '',
    isIOS: typeof window !== 'undefined' ? /iPhone|iPad|iPod/.test(navigator.userAgent) : false,
    isAndroid: typeof window !== 'undefined' ? /Android/.test(navigator.userAgent) : false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    isTelegramWebAppAvailable: typeof window !== 'undefined' ? !!(window.Telegram && window.Telegram.WebApp) : false
  };
};
