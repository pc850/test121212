
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { TokenWithBalance } from "@/utils/tonswapApi";

interface TokenInputProps {
  amount: string;
  onChange: (value: string) => void;
  onMaxClick?: () => void;
  token?: TokenWithBalance;
  isCalculating?: boolean;
  disabled?: boolean;
  showMaxButton?: boolean;
}

const TokenInput = ({
  amount,
  onChange,
  onMaxClick,
  token,
  isCalculating = false,
  disabled = false,
  showMaxButton = false,
}: TokenInputProps) => {
  return (
    <div className="relative flex-1">
      <Input
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          isCalculating && "text-gray-400",
          showMaxButton && "pr-16"
        )}
        disabled={disabled || isCalculating}
      />
      {showMaxButton && onMaxClick && (
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-fipt-blue"
          onClick={onMaxClick}
          disabled={disabled}
        >
          MAX
        </button>
      )}
      {isCalculating && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default TokenInput;
