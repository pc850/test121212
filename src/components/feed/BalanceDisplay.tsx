
import { cn } from "@/lib/utils";

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <span className={cn(
        "px-3 py-1 rounded-full backdrop-blur-sm text-xs font-medium text-white drop-shadow-md",
        balance >= 11 ? "bg-black/30" : "bg-red-500/50"
      )}>
        {balance} FIPT
      </span>
    </div>
  );
};

export default BalanceDisplay;
