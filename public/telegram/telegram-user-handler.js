
// Telegram user authentication handling
(function() {
  // Initialize bridge namespace if not exists
  window.telegramBridge = window.telegramBridge || {};

  // Handle Telegram user login and store user data
  window.telegramBridge.handleTelegramUserLogin = function(user, initData) {
    if (!user) return;
    
    // Store basic user data for immediate access
    const telegramUser = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || undefined,
      username: user.username || undefined,
      photo_url: user.photo_url || undefined,
      auth_date: Math.floor(Date.now() / 1000),
      hash: initData
    };
    localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
    
    console.log('Auto-stored Telegram user:', telegramUser);
    
    // Dispatch event to notify app of login
    window.dispatchEvent(new CustomEvent('telegramUserAutoLogin', { 
      detail: { user: telegramUser } 
    }));
  };

  // Create a mock Telegram environment for testing
  window.telegramBridge.createMockTelegramEnvironment = function(tgWebAppData) {
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
        initDataUnsafe: tgWebAppData ? JSON.parse(decodeURIComponent(tgWebAppData)) : { user: null },
        initData: tgWebAppData || '',
        // Add a note about which bot we're using
        botInfo: {
          username: 'Chicktok_bot'
        }
      }
    };
    
    if (tgWebAppData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(tgWebAppData));
        console.log('Parsed test WebApp data:', parsedData);
        
        if (parsedData.user) {
          window.telegramBridge.handleTelegramUserLogin(parsedData.user, tgWebAppData);
        }
      } catch (e) {
        console.error('Failed to parse tgWebAppData:', e);
      }
    }
  };
})();
