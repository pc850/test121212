
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SwapButtonProps {
  isLoading: boolean;
  connected: boolean;
  fromAmount: string;
  toAmount: string;
  onClick: () => void;
}

const SwapButton = ({
  isLoading,
  connected,
  fromAmount,
  toAmount,
  onClick,
}: SwapButtonProps) => {
  return (
    <Button 
      className="w-full py-6 text-base font-semibold"
      onClick={onClick}
      disabled={!fromAmount || !toAmount || isLoading || !connected}
    >
      {isLoading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Swapping...</>
      ) : !connected ? (
        "Connect Wallet to Swap"
      ) : !fromAmount || !toAmount ? (
        "Enter an amount"
      ) : (
        "Swap Tokens"
      )}
    </Button>
  );
};

export default SwapButton;
