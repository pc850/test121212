
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { TelegramUser } from "@/types/telegram";

interface UserHeaderProps {
  telegramUser: TelegramUser;
  onLogout: () => void;
  onRefresh: () => void;
}

const UserHeader = ({ telegramUser, onLogout, onRefresh }: UserHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3 border-2 border-fipt-blue">
          {telegramUser.photo_url ? (
            <AvatarImage src={telegramUser.photo_url} alt={telegramUser.first_name} />
          ) : (
            <AvatarFallback>{telegramUser.first_name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h3 className="font-medium text-fipt-dark">
            {telegramUser.first_name} {telegramUser.last_name || ''}
          </h3>
          {telegramUser.username && (
            <p className="text-xs text-fipt-muted">@{telegramUser.username}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span className="text-xs">Refresh</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
