(function() {
  // Initialize bridge namespace if not exists
  window.telegramBridge = window.telegramBridge || {};

  // Enhance Telegram.WebApp.openLink specifically for Tonkeeper wallet connections
  window.telegramBridge.enhanceTelegramOpenLink = function() {
    if (!window.Telegram || !window.Telegram.WebApp) {
      console.warn('Cannot enhance Telegram.WebApp.openLink: WebApp not available');
      return;
    }
    
    // Store original method
    const originalOpenLink = window.Telegram.WebApp.openLink;
    
    // Replace with enhanced version
    window.Telegram.WebApp.openLink = function(url) {
      console.log('Enhanced openLink called with:', url);
      
      // Special handling for Tonkeeper URLs
      const isTonkeeperURL = url.includes('tonkeeper') || 
                            url.includes('ton://') ||
                            url.includes('tc://');
      
      if (isTonkeeperURL) {
        // Track all Tonkeeper connection attempts
        const sessionId = Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now();
        
        console.log(`[${sessionId}] Detected Tonkeeper URL, using special handling`);
        
        // Add tracking parameters to URL
        try {
          const separator = url.includes('?') ? '&' : '?';
          const enhancedUrl = `${url}${separator}t=${timestamp}&session=${sessionId}&source=telegram-mini-app`;
          console.log(`[${sessionId}] Enhanced URL: ${enhancedUrl}`);
          url = enhancedUrl;
        } catch (e) {
          console.error('Error enhancing URL:', e);
        }
        
        // For Tonkeeper URLs, use very specific approach for Telegram Mini Apps
        try {
          // Try to use the original method first
          originalOpenLink.call(window.Telegram.WebApp, url);
          console.log(`[${sessionId}] Opened Tonkeeper URL with Telegram.WebApp.openLink`);
        } catch (e) {
          console.error(`[${sessionId}] Error using Telegram API for Tonkeeper URL:`, e);
          
          // Try window.open as fallback
          try {
            const win = window.open(url, '_blank');
            console.log(`[${sessionId}] Opened Tonkeeper URL with window.open`, win ? 'successfully' : 'failed');
            
            // If window.open didn't work (likely blocked), try direct navigation
            if (!win) {
              console.log(`[${sessionId}] window.open failed, trying location.href`);
              window.location.href = url;
            }
          } catch (e2) {
            console.error(`[${sessionId}] All methods failed to open Tonkeeper:`, e2);
            // Last resort
            window.location.href = url;
          }
        }
        return;
      }
      
      // Default behavior for non-Tonkeeper URLs
      console.log('Using default openLink for non-Tonkeeper URL');
      originalOpenLink.call(window.Telegram.WebApp, url);
    };
    
    console.log('Telegram.WebApp.openLink enhanced for Tonkeeper support');
  };

  // Helper to open Tonkeeper wallet
  window.telegramBridge.openTonkeeperWallet = function(url, options = {}) {
    if (!url) {
      console.error('No URL provided to openTonkeeperWallet');
      return false;
    }
    
    // Generate a unique session ID
    const sessionId = options.sessionId || Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    
    console.log(`[${sessionId}] Opening Tonkeeper wallet with URL:`, url);
    
    // Add tracking parameters to URL
    const separator = url.includes('?') ? '&' : '?';
    const enhancedUrl = `${url}${separator}t=${timestamp}&session=${sessionId}&source=telegram-mini-app`;
    
    // Use Telegram's openLink if available
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openLink) {
      try {
        window.Telegram.WebApp.openLink(enhancedUrl);
        console.log(`[${sessionId}] Opened with Telegram.WebApp.openLink`);
        return true;
      } catch (e) {
        console.error(`[${sessionId}] Error with Telegram.WebApp.openLink:`, e);
      }
    }
    
    // Fallback to window.open
    try {
      const win = window.open(enhancedUrl, '_blank');
      if (win) {
        console.log(`[${sessionId}] Opened with window.open`);
        return true;
      }
    } catch (e) {
      console.error(`[${sessionId}] Error with window.open:`, e);
    }
    
    // Last resort: direct navigation
    try {
      window.location.href = enhancedUrl;
      console.log(`[${sessionId}] Redirecting with location.href`);
      return true;
    } catch (e) {
      console.error(`[${sessionId}] All methods failed:`, e);
      return false;
    }
  };
})();
