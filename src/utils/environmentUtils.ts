
/**
 * Utilities for detecting environment (mobile, Telegram Mini App, etc.)
 */

/**
 * Detects if the current device is a mobile device based on user agent
 */
export const detectMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Force mobile detection for common mobile devices
  const userAgent = navigator.userAgent || '';
  if (/iPhone|iPad|iPod|Android/i.test(userAgent)) {
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
  
  return matchCount >= 2;
};

/**
 * Detects if the app is running in Telegram Mini App environment
 */
export const isTelegramMiniAppEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if Telegram WebApp object exists
  const hasTelegramWebApp = !!(window.Telegram && window.Telegram.WebApp);
  
  // Check URL parameters for Telegram-specific parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hasTelegramParams = urlParams.has('tgWebAppData') || 
                           urlParams.has('tgWebAppStartParam') || 
                           urlParams.has('tgWebAppPlatform');
  
  // Check local storage for explicit flags
  const storedFlag = localStorage.getItem('isTelegramMiniApp') === 'true';
  
  return hasTelegramWebApp || hasTelegramParams || storedFlag;
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
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0
  };
};
