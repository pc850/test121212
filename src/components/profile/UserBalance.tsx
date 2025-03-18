
import { TelegramUser } from "@/types/telegram";

interface UserBalanceProps {
  balance: number;
  points: number;
  telegramUser: TelegramUser | null;
  supabaseUser?: any;
}

const UserBalance = ({ balance, points, telegramUser, supabaseUser }: UserBalanceProps) => {
  // Get user ID from either auth source
  const getUserId = () => {
    if (telegramUser) {
      return `tg_${telegramUser.id}`;
    } else if (supabaseUser) {
      return supabaseUser.id.substring(0, 8);
    }
    return "unknown";
  };
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Available Balance</p>
          <p className="text-xl font-bold bg-gradient-to-r from-fipt-blue to-fipt-accent bg-clip-text text-transparent">
            {balance.toLocaleString()} TEST
          </p>
        </div>
        <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-muted-foreground border border-gray-100">
          ID: {getUserId()}
        </div>
      </div>
      
      <div className="flex items-center">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Points</p>
          <p className="text-lg font-bold text-fipt-blue">
            {points.toLocaleString()} pts
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
