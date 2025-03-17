
import { cn } from "@/lib/utils";
import { TokenWithBalance } from "@/utils/tonswapApi";

interface TransactionDetailsProps {
  toAmount: string;
  slippage: string;
  toToken?: TokenWithBalance;
  priceImpact: number;
}

const TransactionDetails = ({
  toAmount,
  slippage,
  toToken,
  priceImpact,
}: TransactionDetailsProps) => {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-medium text-fipt-dark mb-3">Transaction Details</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-fipt-muted">Minimum received</span>
          <span className="font-medium">{
            toAmount ? 
            (parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6) :
            "0.00"
          } {toToken?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fipt-muted">Network Fee</span>
          <span className="font-medium">~0.01 TON</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fipt-muted">Price Impact</span>
          <span className={cn(
            "font-medium",
            priceImpact > 0.05 ? "text-red-500" : 
            priceImpact > 0.02 ? "text-yellow-500" : "text-green-500"
          )}>
            {priceImpact > 0 ? `${(priceImpact * 100).toFixed(2)}%` : '<0.01%'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
