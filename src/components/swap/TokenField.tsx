
import TokenSelector from "./TokenSelector";
import TokenInput from "./TokenInput";
import { TokenWithBalance } from "@/utils/tonswapApi";

interface TokenFieldProps {
  label: string;
  tokenValue: string;
  onTokenChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  tokens: TokenWithBalance[];
  excludeTokenId?: string;
  tokenData?: TokenWithBalance;
  isCalculating?: boolean;
  disabled?: boolean;
  showMaxButton?: boolean;
  onMaxClick?: () => void;
}

const TokenField = ({
  label,
  tokenValue,
  onTokenChange,
  amount,
  onAmountChange,
  tokens,
  excludeTokenId,
  tokenData,
  isCalculating = false,
  disabled = false,
  showMaxButton = false,
  onMaxClick,
}: TokenFieldProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-fipt-muted">{label}</label>
        <span className="text-xs text-fipt-muted">
          Balance: {tokenData?.balance || 0} {tokenData?.name}
        </span>
      </div>
      <div className="flex gap-2">
        <TokenSelector
          value={tokenValue}
          onChange={onTokenChange}
          tokens={tokens}
          excludeTokenId={excludeTokenId}
          disabled={disabled}
        />
        <TokenInput
          amount={amount}
          onChange={onAmountChange}
          token={tokenData}
          isCalculating={isCalculating}
          disabled={disabled}
          showMaxButton={showMaxButton}
          onMaxClick={onMaxClick}
        />
      </div>
    </div>
  );
};

export default TokenField;
