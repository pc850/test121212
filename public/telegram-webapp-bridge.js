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
      
      // Enhanced openLink handler specifically for wallet connections
      const originalOpenLink = window.Telegram.WebApp.openLink;
      window.Telegram.WebApp.openLink = function(url) {
        console.log('Enhanced openLink called with:', url);
        
        // Check if this is a Tonkeeper URL
        const isTonkeeperURL = url.includes('tonkeeper') || 
                              url.includes('ton://') ||
                              url.includes('tc://');
        
        if (isTonkeeperURL) {
          console.log('Detected Tonkeeper URL, using special handling');
          // For Tonkeeper URLs, try to open in a new window if regular openLink fails
          try {
            originalOpenLink.call(window.Telegram.WebApp, url);
            console.log('Opened Tonkeeper URL with Telegram.WebApp.openLink');
          } catch (e) {
            console.error('Error opening Tonkeeper URL with Telegram WebApp:', e);
            
            // Fall back to window.open
            try {
              window.open(url, '_blank');
              console.log('Opened Tonkeeper URL with window.open as fallback');
            } catch (e2) {
              console.error('Failed to open with window.open:', e2);
              
              // Last resort: direct navigation
              try {
                window.location.href = url;
                console.log('Set window.location.href to Tonkeeper URL as last resort');
              } catch (e3) {
                console.error('All methods of opening Tonkeeper URL failed:', e3);
              }
            }
          }
          return;
        }
        
        // Default behavior for non-Tonkeeper URLs
        console.log('Using default openLink for non-Tonkeeper URL');
        originalOpenLink.call(window.Telegram.WebApp, url);
      };
      
      // Add handler for external links to open in browser
      const originalOpen = window.open;
      window.open = function(url, target, features) {
        console.log('Intercepted window.open:', url, target);
        
        // Special handling for Tonkeeper URLs
        const isTonkeeperURL = url && (
          url.includes('tonkeeper') || 
          url.includes('ton://') ||
          url.includes('tc://')
        );
        
        if (isTonkeeperURL) {
          console.log('Detected Tonkeeper URL in window.open');
          
          // Try Telegram WebApp.openLink first for Tonkeeper
          try {
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openLink) {
              console.log('Using Telegram.WebApp.openLink for Tonkeeper URL');
              window.Telegram.WebApp.openLink(url);
              return null;
            }
          } catch (e) {
            console.error('Failed to use Telegram.WebApp.openLink for Tonkeeper:', e);
          }
          
          // If openLink fails, try window.location.href
          try {
            window.location.href = url;
            console.log('Set window.location.href to Tonkeeper URL');
            return null;
          } catch (e) {
            console.error('Failed to set location.href for Tonkeeper:', e);
          }
        } else if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
          // For other external URLs in Telegram Mini App, try to use Telegram's openLink
          try {
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openLink) {
              console.log('Using Telegram.WebApp.openLink for:', url);
              window.Telegram.WebApp.openLink(url);
              return null;
            }
          } catch (e) {
            console.error('Failed to use Telegram.WebApp.openLink:', e);
          }
        }
        
        // Fall back to original behavior
        return originalOpen.call(window, url, target, features);
      };
      
      // Call ready after everything is set up
      window.Telegram.WebApp.ready();
    } else {
      console.log('Not running in Telegram WebApp environment');
      localStorage.removeItem('isTelegramMiniApp');
      localStorage.removeItem('tonconnect_in_telegram');
      
      // Check if we have WebApp data in the URL for testing
      const urlParams = new URLSearchParams(window.location.search);
      const tgWebAppData = urlParams.get('tgWebAppData');
      if (tgWebAppData) {
        console.log('Found tgWebAppData in URL params:', tgWebAppData);
        try {
          const data = JSON.parse(decodeURIComponent(tgWebAppData));
          console.log('Parsed WebApp data:', data);
          
          // Store the data for the app to use
          localStorage.setItem('telegramWebAppData', JSON.stringify(data));
          
          // Create a mock WebApp object
          window.Telegram = {
            WebApp: {
              initData: tgWebAppData,
              initDataUnsafe: data,
              expand: () => {},
              ready: () => {},
              openLink: (url) => { window.open(url, '_blank'); }
            }
          };
          
          // Store user data for auto-login
          if (data.user) {
            const telegramUser = {
              id: data.user.id,
              first_name: data.user.first_name,
              last_name: data.user.last_name || undefined,
              username: data.user.username || undefined,
              photo_url: data.user.photo_url || undefined,
              auth_date: Math.floor(Date.now() / 1000),
              hash: tgWebAppData
            };
            localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
            
            // Dispatch event to notify app of login
            window.dispatchEvent(new CustomEvent('telegramUserAutoLogin', { 
              detail: { user: telegramUser } 
            }));
          }
          
          const event = new CustomEvent('telegramWebAppInitialized', {
            detail: { webApp: window.Telegram.WebApp }
          });
          window.dispatchEvent(event);
          
          console.log('Created mock Telegram WebApp object for testing');
        } catch (e) {
          console.error('Failed to parse tgWebAppData:', e);
        }
      }
    }
  });
})();
