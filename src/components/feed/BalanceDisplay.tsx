
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { TelegramUser } from "@/types/telegram";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [points, setPoints] = useState<number>(0);
  
  useEffect(() => {
    // Check if user is logged in with Telegram
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      try {
        setTelegramUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    
    // Get points from localStorage
    const storedPoints = localStorage.getItem('testPoints');
    if (storedPoints) {
      setPoints(parseInt(storedPoints, 10));
    }
  }, []);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
      <div className="flex items-center">
        {telegramUser && (
          <Avatar className="h-7 w-7 mr-2 border-2 border-white shadow-md">
            {telegramUser.photo_url ? (
              <AvatarImage src={telegramUser.photo_url} alt={telegramUser.first_name} />
            ) : (
              <AvatarFallback>{telegramUser.first_name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
        )}
        <span className={cn(
          "px-3 py-1 rounded-full backdrop-blur-sm text-xs font-medium text-white drop-shadow-md",
          balance >= 11 ? "bg-black/30" : "bg-red-500/50"
        )}>
          {balance} TEST
        </span>
      </div>
      
      <span className="px-3 py-1 rounded-full backdrop-blur-sm text-xs font-medium bg-fipt-blue/50 text-white drop-shadow-md">
        {points} pts
      </span>
    </div>
  );
};

export default BalanceDisplay;
