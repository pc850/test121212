
import React from "react";

interface WalletUnavailableNoticeProps {
  hasTonkeeper: boolean;
  isConnecting: boolean;
}

const WalletUnavailableNotice: React.FC<WalletUnavailableNoticeProps> = ({ 
  hasTonkeeper,
  isConnecting
}) => {
  if (hasTonkeeper || isConnecting) {
    return null;
  }
  
  return (
    <div className="p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
      <p className="font-medium">Tonkeeper Not Found</p>
      <p>Tonkeeper wallet is not available. You may need to install the Tonkeeper app or extension first.</p>
    </div>
  );
};

export default WalletUnavailableNotice;
