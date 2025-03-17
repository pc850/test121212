
/**
 * Utilities for detecting environment (mobile, Telegram Mini App, etc.)
 */

/**
 * Detects if the current device is a mobile device based on user agent
 */
export const detectMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  return mobileRegex.test(userAgent.toLowerCase());
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
  
  return hasTelegramWebApp || hasTelegramParams;
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
    isAndroid: typeof window !== 'undefined' ? /Android/.test(navigator.userAgent) : false
  };
};
