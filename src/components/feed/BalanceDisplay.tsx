
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BalanceDisplayProps {
  balance: number;
  isLoading?: boolean;
}

const BalanceDisplay = ({ balance, isLoading = false }: BalanceDisplayProps) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      {isLoading ? (
        <Skeleton className="h-6 w-20 rounded-full" />
      ) : (
        <span className={cn(
          "px-3 py-1 rounded-full backdrop-blur-sm text-xs font-medium text-white drop-shadow-md",
          balance >= 11 ? "bg-black/30" : "bg-red-500/50"
        )}>
          {balance} FIPT
        </span>
      )}
    </div>
  );
};

export default BalanceDisplay;
