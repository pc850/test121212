
import React from "react";
import { Button } from "@/components/ui";
import { ExternalLink, RefreshCw } from "lucide-react";

interface ConnectButtonProps {
  isConnecting: boolean;
  showRetry: boolean;
  redirectInProgress: boolean;
  isTelegramMiniApp: boolean;
  isMobile: boolean;
  onClick: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  isConnecting,
  showRetry,
  redirectInProgress,
  isTelegramMiniApp,
  isMobile,
  onClick
}) => {
  return (
    <Button
      variant="outline"
      className="justify-start gap-2"
      onClick={onClick}
      disabled={isConnecting && !showRetry}
    >
      <img
        src="https://tonkeeper.com/assets/tonconnect-icon.png"
        alt="Tonkeeper"
        className="h-5 w-5"
      />
      {isConnecting && !showRetry ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {redirectInProgress ? "Redirecting to Tonkeeper..." : "Opening Tonkeeper..."}
        </span>
      ) : showRetry ? (
        <span className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-1 text-yellow-500" />
          Try Again
        </span>
      ) : (
        isTelegramMiniApp ? (
          <>Open in Tonkeeper Browser <ExternalLink className="h-4 w-4 ml-1" /></>
        ) : isMobile ? (
          <>Open Tonkeeper App <ExternalLink className="h-4 w-4 ml-1" /></>
        ) : "Connect Tonkeeper"
      )}
    </Button>
  );
};

export default ConnectButton;
