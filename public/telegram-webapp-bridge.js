
// Main loader for Telegram WebApp bridge
// This file loads all bridge components in the correct order
(function() {
  // Define the bridge components to load
  const bridgeComponents = [
    '/telegram/telegram-user-handler.js',
    '/telegram/tonkeeper-bridge.js',
    '/telegram/telegram-bridge.js'
  ];
  
  // Function to load a script asynchronously
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Load in order
      
      script.onload = () => {
        console.log(`Loaded bridge component: ${src}`);
        resolve();
      };
      
      script.onerror = () => {
        console.error(`Failed to load bridge component: ${src}`);
        reject(new Error(`Failed to load: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  }
  
  // Load all components in sequence
  async function loadAllComponents() {
    for (const component of bridgeComponents) {
      try {
        await loadScript(component);
      } catch (error) {
        console.error('Error loading Telegram bridge components:', error);
      }
    }
    console.log('All Telegram bridge components loaded');
  }
  
  // Start loading components
  loadAllComponents();
})();
