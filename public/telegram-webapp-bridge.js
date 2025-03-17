
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
      
      // Set flag for mobile environment
      localStorage.setItem('isTelegramMiniApp', 'true');
      
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
      
      // Call ready after everything is set up
      window.Telegram.WebApp.ready();
    } else {
      console.log('Not running in Telegram WebApp environment');
      localStorage.removeItem('isTelegramMiniApp');
      
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
              ready: () => {}
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
