
import { TelegramUser } from "@/types/telegram";

interface UserBalanceProps {
  balance: number;
  telegramUser: TelegramUser | null;
  supabaseUser?: any;
}

const UserBalance = ({ balance, telegramUser, supabaseUser }: UserBalanceProps) => {
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
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Available Balance</p>
          <p className="text-xl font-bold text-fipt-blue">{balance.toLocaleString()} FIPT</p>
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded text-xs text-muted-foreground">
          ID: {getUserId()}
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
