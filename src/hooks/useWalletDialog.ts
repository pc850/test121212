
import { useState, useEffect } from "react";

export const useWalletDialog = (
  connected: boolean, 
  isConnecting: boolean, 
  isMobile: boolean, 
  isTelegramMiniApp: boolean
) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  // Auto-close the dialog if we're in a Telegram Mini App and have attempted connection
  useEffect(() => {
    if (connectionAttempted && (isMobile || isTelegramMiniApp)) {
      const timer = setTimeout(() => {
        setDialogOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [connectionAttempted, isMobile, isTelegramMiniApp]);

  // Reset connection attempt state when connection state changes
  useEffect(() => {
    if (!isConnecting && connected) {
      setConnectionAttempted(false);
    }
  }, [isConnecting, connected]);

  return {
    dialogOpen,
    setDialogOpen,
    connectionAttempted,
    setConnectionAttempted
  };
};
