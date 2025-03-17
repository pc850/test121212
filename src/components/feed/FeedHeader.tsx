
import { Search } from "lucide-react";
import TonConnectButton from "@/components/TonConnectButton";

interface FeedHeaderProps {
  balance: number;
}

const FeedHeader = ({ balance }: FeedHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 py-3 px-4 flex items-center justify-between glass">
      <h1 className="text-xl font-bold text-fipt-dark">FIPT Feed</h1>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full bg-fipt-blue/10 text-sm font-medium text-fipt-blue">
          {balance} FIPT
        </span>
        <TonConnectButton />
        <div className="relative">
          <input 
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-2 w-32 rounded-full text-sm text-fipt-dark bg-fipt-gray border-none focus:outline-none focus:ring-2 focus:ring-fipt-blue"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fipt-muted" />
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
