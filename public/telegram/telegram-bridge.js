
// Core Telegram WebApp bridge functionality
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
      
      // Trigger user auto-login if user data is available
      if (window.Telegram.WebApp.initDataUnsafe?.user) {
        // Import and run user login handling
        const { handleTelegramUserLogin } = window.telegramBridge || {};
        if (handleTelegramUserLogin) {
          handleTelegramUserLogin(window.Telegram.WebApp.initDataUnsafe.user, window.Telegram.WebApp.initData);
        }
      }
      
      // Override openLink method with enhanced version for better app experience
      const { enhanceTelegramOpenLink } = window.telegramBridge || {};
      if (enhanceTelegramOpenLink) {
        enhanceTelegramOpenLink();
      }
      
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
        
        // Import and use the mock environment creator
        const { createMockTelegramEnvironment } = window.telegramBridge || {};
        if (createMockTelegramEnvironment) {
          createMockTelegramEnvironment(tgWebAppData);
        }
      } else {
        localStorage.removeItem('isTelegramMiniApp');
        localStorage.removeItem('tonconnect_in_telegram');
      }
    }
  });
})();
