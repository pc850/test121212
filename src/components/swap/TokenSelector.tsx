
import { SUPPORTED_TOKENS, TokenWithBalance } from "@/utils/tonswapApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
  tokens: TokenWithBalance[];
  excludeTokenId?: string;
  disabled?: boolean;
}

const TokenSelector = ({
  value,
  onChange,
  tokens,
  excludeTokenId,
  disabled = false,
}: TokenSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-1/3">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {tokens.map(token => (
          token.id !== excludeTokenId && (
            <SelectItem key={token.id} value={token.id}>
              <div className="flex items-center gap-2">
                <span>{token.icon}</span>
                <span>{token.name}</span>
              </div>
            </SelectItem>
          )
        ))}
      </SelectContent>
    </Select>
  );
};

export default TokenSelector;
