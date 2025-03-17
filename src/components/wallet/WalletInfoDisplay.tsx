
import React from "react";

interface WalletInfoDisplayProps {
  address: string | null;
  telegramUser: {
    id: number;
    username?: string;
    first_name: string;
  } | null;
}

const WalletInfoDisplay: React.FC<WalletInfoDisplayProps> = ({ 
  address, 
  telegramUser 
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md">
        <p className="text-sm font-medium">Wallet Address</p>
        <p className="text-xs text-muted-foreground break-all">
          {address}
        </p>
        
        {telegramUser && (
          <div className="mt-2 pt-2 border-t border-muted-foreground/10">
            <p className="text-sm font-medium">Linked to Telegram</p>
            <p className="text-xs text-muted-foreground">
              @{telegramUser.username || telegramUser.first_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfoDisplay;
