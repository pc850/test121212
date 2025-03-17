
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui";
import { TelegramUser } from "@/types/telegram";
import WalletInfoDisplay from "@/components/wallet/WalletInfoDisplay";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { Button } from "@/components/ui/button";

interface WalletDialogContentProps {
  connected: boolean;
  isConnecting: boolean;
  address: string | null;
  telegramUser: TelegramUser | null;
  walletInfo: string;
  available: any[];
  isMobile: boolean;
  isTelegramMiniApp: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletDialogContent: React.FC<WalletDialogContentProps> = ({
  connected,
  isConnecting,
  address,
  telegramUser,
  walletInfo,
  available,
  isMobile,
  isTelegramMiniApp,
  onConnect,
  onDisconnect
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {connected ? "Wallet Connected" : "Connect your TON wallet"}
        </DialogTitle>
        <DialogDescription>
          {connected
            ? "Your wallet is connected to FIPT Shop"
            : "Connect your Tonkeeper wallet to log in or sign up"}
        </DialogDescription>
      </DialogHeader>
      
      {connected ? (
        <div className="space-y-4">
          <WalletInfoDisplay 
            address={address} 
            telegramUser={telegramUser} 
          />
          <Button
            variant="destructive"
            className="w-full"
            onClick={onDisconnect}
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <WalletConnectButton
          isConnecting={isConnecting}
          telegramUser={telegramUser}
          walletInfo={walletInfo}
          available={available}
          onConnect={onConnect}
          isMobile={isMobile}
          isTelegramMiniApp={isTelegramMiniApp}
        />
      )}
    </>
  );
};

export default WalletDialogContent;
