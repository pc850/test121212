import { TonConnect, isWalletInfoInjectable, WalletInfoRemote } from "@tonconnect/sdk";

export const connectToTonkeeper = async (
  wallet: TonConnect,
  available: any[],
  isMobile: boolean,
  isTelegramMiniApp: boolean,
  setIsConnecting: (connecting: boolean) => void,
  setConnectionTimeout: (timeout: ReturnType<typeof setTimeout> | null) => void,
  connectionTimeout: ReturnType<typeof setTimeout> | null
) => {
  console.log("Starting wallet connection attempt...");
  console.log("Environment:", { isMobile, isTelegramMiniApp });
  console.log("Available wallets:", available.map(w => w.name));

  // Clean up any existing timeout
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
  }

  try {
    // Set connecting state
    setIsConnecting(true);

    // Find Tonkeeper in available wallets
    const tonkeeper = available.find(w => 
      w.name.toLowerCase().includes('tonkeeper') || 
      (w.appName && w.appName.toLowerCase().includes('tonkeeper'))
    );

    if (!tonkeeper) {
      console.error("Tonkeeper wallet not found in available wallets");
      setIsConnecting(false);
      return;
    }

    console.log("Found Tonkeeper wallet:", tonkeeper);

    // Set a timeout to reset the connecting state if it takes too long
    const timeout = setTimeout(() => {
      console.log("Connection attempt timed out");
      setIsConnecting(false);
    }, 30000); // 30 seconds timeout
    
    setConnectionTimeout(timeout);

    // Determine connection method based on environment
    if (isTelegramMiniApp) {
      console.log("Connecting using Telegram Mini App approach");
      
      // For Telegram Mini App, we need to use universal URL to open Tonkeeper
      if (tonkeeper.universalUrl) {
        console.log("Using universal URL:", tonkeeper.universalUrl);
        
        // Open the universal URL in a new tab/window
        window.open(tonkeeper.universalUrl, '_blank');
        
        // Attempt to use the connect method as well as a fallback
        try {
          await wallet.connect({
            universalLink: tonkeeper.universalUrl,
            bridgeUrl: tonkeeper.bridge?.[0]?.url
          });
          console.log("Connect method called successfully");
        } catch (e) {
          console.error("Error in wallet.connect method:", e);
        }
      } else {
        console.log("No universal URL available, trying standard connect");
        await wallet.connect({ jsBridgeKey: "tonkeeper" });
      }
    } else if (isMobile) {
      console.log("Connecting on mobile device");
      
      // For mobile, try using universal URL first if available
      if (tonkeeper.universalUrl) {
        console.log("Using universal URL for mobile:", tonkeeper.universalUrl);
        window.location.href = tonkeeper.universalUrl;
        
        // As a fallback, also try the connect method
        try {
          await wallet.connect({
            universalLink: tonkeeper.universalUrl,
            bridgeUrl: tonkeeper.bridge?.[0]?.url
          });
          console.log("Mobile connect method called successfully");
        } catch (e) {
          console.error("Error in mobile wallet.connect method:", e);
        }
      } else if (tonkeeper.deepLink) {
        console.log("Using deep link:", tonkeeper.deepLink);
        window.location.href = tonkeeper.deepLink;
      } else {
        console.log("No deep link or universal URL, using standard connect");
        await wallet.connect({ jsBridgeKey: "tonkeeper" });
      }
    } else {
      // For desktop browsers
      console.log("Connecting on desktop browser");
      
      if (isWalletInfoInjectable(tonkeeper)) {
        console.log("Using injectable wallet connection");
        await wallet.connect({ jsBridgeKey: "tonkeeper" });
      } else if ((tonkeeper as WalletInfoRemote).universalLink) {
        console.log("Using universal link for desktop:", (tonkeeper as WalletInfoRemote).universalLink);
        const link = (tonkeeper as WalletInfoRemote).universalLink;
        window.open(link, '_blank');
        
        // Also try the connect method
        try {
          await wallet.connect({
            universalLink: link,
            bridgeUrl: (tonkeeper as WalletInfoRemote).bridgeUrl
          });
          console.log("Desktop connect method called successfully");
        } catch (e) {
          console.error("Error in desktop wallet.connect method:", e);
        }
      } else {
        console.log("Using standard connect method");
        await wallet.connect({ jsBridgeKey: "tonkeeper" });
      }
    }

    console.log("Connection attempt completed without errors");
    return;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    setIsConnecting(false);
    throw error;
  }
};
