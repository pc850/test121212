// Bridge script to check if we're running in a Telegram Mini App
(function() {
  // Try to detect if running inside a Telegram WebApp
  window.addEventListener('DOMContentLoaded', function() {
    console.log('Checking for Telegram WebApp environment...');
    
    if (window.Telegram && window.Telegram.WebApp) {
      console.log('Telegram WebApp detected!', window.Telegram.WebApp);
      
      // Set up a global event to notify the app
      const event = new CustomEvent('telegramWebAppInitialized', {
        detail: { webApp: window.Telegram.WebApp }
      });
      window.dispatchEvent(event);
      
      // Expand the WebApp to take the full height
      window.Telegram.WebApp.expand();
      
      // Store the WebApp data for accessibility throughout the app
      localStorage.setItem('telegramWebAppData', JSON.stringify(window.Telegram.WebApp.initDataUnsafe));
      
      // Create a global access point
      window.telegramWebApp = window.Telegram.WebApp;
      
      // Set flag for Telegram Mini App environment
      localStorage.setItem('isTelegramMiniApp', 'true');
      
      // Add a special flag for TonConnect to properly handle Mini App environment
      localStorage.setItem('tonconnect_in_telegram', 'true');
      
      // Trigger auto-login when WebApp is ready
      if (window.Telegram.WebApp.initDataUnsafe?.user) {
        // Store basic user data for immediate access
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        const telegramUser = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || undefined,
          username: user.username || undefined,
          photo_url: user.photo_url || undefined,
          auth_date: Math.floor(Date.now() / 1000),
          hash: window.Telegram.WebApp.initData
        };
        localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
        
        console.log('Auto-stored Telegram user:', telegramUser);
        
        // Dispatch event to notify app of login
        window.dispatchEvent(new CustomEvent('telegramUserAutoLogin', { 
          detail: { user: telegramUser } 
        }));
      }
      
      // CRITICAL: Enhanced openLink handler specifically for Tonkeeper
      const originalOpenLink = window.Telegram.WebApp.openLink;
      window.Telegram.WebApp.openLink = function(url) {
        console.log('Enhanced openLink called with:', url);
        
        // Special handling for Tonkeeper URLs
        const isTonkeeperURL = url.includes('tonkeeper') || 
                              url.includes('ton://') ||
                              url.includes('tc://');
        
        if (isTonkeeperURL) {
          console.log('Detected Tonkeeper URL, using special handling');
          
          // For Tonkeeper URLs, use very specific approach for Telegram Mini Apps
          try {
            // Try to use the original method first
            originalOpenLink.call(window.Telegram.WebApp, url);
            console.log('Opened Tonkeeper URL with Telegram.WebApp.openLink');
          } catch (e) {
            console.error('Error using Telegram API for Tonkeeper URL:', e);
            
            // Try window.open as fallback
            try {
              const win = window.open(url, '_blank');
              console.log('Opened Tonkeeper URL with window.open', win ? 'successfully' : 'failed');
              
              // If window.open didn't work (likely blocked), try direct navigation
              if (!win) {
                console.log('window.open failed, trying location.href');
                window.location.href = url;
              }
            } catch (e2) {
              console.error('All methods failed to open Tonkeeper:', e2);
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
      
      // Call ready after everything is set up
      window.Telegram.WebApp.ready();
      
      // Set MainButton handling - important for some Mini Apps UX
      if (window.Telegram.WebApp.MainButton) {
        window.Telegram.WebApp.MainButton.setText('Connect Wallet');
        window.Telegram.WebApp.MainButton.onClick(function() {
          // Dispatch event to trigger wallet connection
          window.dispatchEvent(new CustomEvent('telegramMainButtonClicked'));
        });
      }
    } else {
      console.log('Not running in Telegram WebApp environment');
      
      // Check URL for testing parameters
      const urlParams = new URLSearchParams(window.location.search);
      const tgWebAppData = urlParams.get('tgWebAppData');
      const forceTelegram = urlParams.get('forceTelegram');
      
      // Allow forcing Telegram mode for testing
      if (forceTelegram === 'true' || tgWebAppData) {
        console.log('Forcing Telegram Mini App environment for testing');
        localStorage.setItem('isTelegramMiniApp', 'true');
        localStorage.setItem('tonconnect_in_telegram', 'true');
        
        // Create a minimal Telegram WebApp object for testing
        window.Telegram = {
          WebApp: {
            openLink: function(url) {
              console.log('Mock Telegram.WebApp.openLink called:', url);
              window.open(url, '_blank');
            },
            ready: function() {},
            expand: function() {},
            initDataUnsafe: tgWebAppData ? JSON.parse(decodeURIComponent(tgWebAppData)) : { user: null }
          }
        };
        
        if (tgWebAppData) {
          try {
            const parsedData = JSON.parse(decodeURIComponent(tgWebAppData));
            console.log('Parsed test WebApp data:', parsedData);
            
            if (parsedData.user) {
              const telegramUser = {
                id: parsedData.user.id,
                first_name: parsedData.user.first_name,
                last_name: parsedData.user.last_name || undefined,
                username: parsedData.user.username || undefined,
                photo_url: parsedData.user.photo_url || undefined,
                auth_date: Math.floor(Date.now() / 1000),
                hash: tgWebAppData
              };
              localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
              
              window.dispatchEvent(new CustomEvent('telegramUserAutoLogin', { 
                detail: { user: telegramUser } 
              }));
            }
          } catch (e) {
            console.error('Failed to parse tgWebAppData:', e);
          }
        }
      } else {
        localStorage.removeItem('isTelegramMiniApp');
        localStorage.removeItem('tonconnect_in_telegram');
      }
    }
  });
})();
