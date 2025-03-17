
import React from "react";
import { Button } from "@/components/ui";
import { TelegramUser } from "@/components/TelegramLoginButton";

interface WalletConnectButtonProps {
  isConnecting: boolean;
  telegramUser: TelegramUser | null;
  walletInfo: string;
  available: any[];
  onConnect: () => void;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  isConnecting,
  telegramUser,
  walletInfo,
  available,
  onConnect
}) => {
  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        className="justify-start gap-2"
        onClick={onConnect}
        disabled={isConnecting}
      >
        <img
          src="https://tonkeeper.com/assets/tonconnect-icon.png"
          alt="Tonkeeper"
          className="h-5 w-5"
        />
        {isConnecting ? "Connecting..." : "Tonkeeper"}
      </Button>
      
      {telegramUser && (
        <div className="p-2 bg-muted rounded-md text-xs text-muted-foreground">
          <p>Connecting will link your wallet to your Telegram account:</p>
          <p className="font-medium mt-1">@{telegramUser.username || telegramUser.first_name}</p>
        </div>
      )}
      
      {/* Debug info */}
      <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
        <p className="font-medium">Debug Info:</p>
        <p className="break-all">{walletInfo}</p>
        <p className="font-medium mt-2">Available Wallets:</p>
        <p className="break-all">{available.length > 0 ? available.map(w => w.name).join(', ') : 'None found'}</p>
      </div>
    </div>
  );
};

export default WalletConnectButton;
