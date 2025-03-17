
import { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";

export const useTonkeeperWallet = () => {
  const [wallet, setWallet] = useState<TonConnect | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connector = new TonConnect({
      manifestUrl: 'https://fipt-wonderland.lovable.app/tonconnect-manifest.json',
    });

    setWallet(connector);

    const checkConnection = async () => {
      if (connector.connected) {
        const walletInfo = connector.wallet;
        if (walletInfo?.account.address) {
          setAddress(walletInfo.account.address);
          setConnected(true);
        }
      }
    };

    checkConnection();

    const unsubscribe = connector.onStatusChange((walletInfo) => {
      if (walletInfo && walletInfo.account) {
        setConnected(true);
        setAddress(walletInfo.account.address);
      } else {
        setConnected(false);
        setAddress(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const connectWallet = async () => {
    if (!wallet) return;

    try {
      await wallet.connect([]);
    } catch (error: any) {
      console.error("Connection error:", error);
    }
  };

  const disconnectWallet = () => {
    if (wallet) {
      wallet.disconnect();
    }
  };

  return { connectWallet, disconnectWallet, connected, address };
};
