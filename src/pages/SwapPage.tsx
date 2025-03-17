
import { useEffect } from "react";
import TonConnectButton from "@/components/TonConnectButton";
import { useTonkeeperWallet } from "@/hooks/useTonkeeperWallet";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

const SwapPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "FIPT - Swap via STON.fi";
  }, []);

  // Connect to wallet and check Telegram auth
  const { connected } = useTonkeeperWallet();
  const { autoLogin, isLoggedIn } = useTelegramAuth();
  
  // Try to auto-login with Telegram if available
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  // Check if we're in Telegram Mini App
  const isTelegramMiniApp = 
    typeof window !== 'undefined' && 
    (window.Telegram?.WebApp || localStorage.getItem('isTelegramMiniApp') === 'true');

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Page Header */}
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-fipt-dark">Swap</h1>
          <p className="text-sm text-fipt-muted">Powered by STON.fi DEX</p>
        </div>
        <TonConnectButton />
      </div>
      
      {/* STON.fi iframe */}
      <div className="flex-1 flex flex-col">
        <iframe 
          src="https://app.ston.fi/swap"
          className="w-full flex-1 border-0"
          title="STON.fi Swap Interface"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-orientation-lock"
          allow="clipboard-write"
        />
        
        {/* Wallet connection notice */}
        {!connected && (
          <div className="m-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
            <p className="font-medium">Connect your TON wallet to start swapping</p>
            <p className="mt-1">Click the "Connect Wallet" button in the top-right corner to connect your Tonkeeper wallet and access the STON.fi DEX.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapPage;
