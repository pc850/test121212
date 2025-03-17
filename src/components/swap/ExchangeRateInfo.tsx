
import { Info } from "lucide-react";
import { TokenWithBalance } from "@/utils/tonswapApi";

interface ExchangeRateInfoProps {
  exchangeRate: number;
  fromToken?: TokenWithBalance;
  toToken?: TokenWithBalance;
}

const ExchangeRateInfo = ({
  exchangeRate,
  fromToken,
  toToken,
}: ExchangeRateInfoProps) => {
  return (
    <div className="p-3 rounded-lg bg-gray-50 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-fipt-muted">
          <Info className="h-4 w-4" />
          <span>Exchange Rate</span>
        </div>
        <span className="text-sm font-medium">
          {exchangeRate ? 
            `1 ${fromToken?.name} ≈ ${exchangeRate.toFixed(6)} ${toToken?.name}` :
            "Enter an amount to see rate"
          }
        </span>
      </div>
    </div>
  );
};

export default ExchangeRateInfo;
