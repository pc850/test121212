
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
    } else {
      console.log('Not running in Telegram WebApp environment');
      
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
