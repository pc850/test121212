
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut } from "lucide-react";
import { TelegramUser } from "@/types/telegram";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserHeaderProps {
  telegramUser: TelegramUser | null;
  supabaseUser?: any;
  onLogout: () => void;
  onRefresh: () => void;
}

const UserHeader = ({ telegramUser, supabaseUser, onLogout, onRefresh }: UserHeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  // Determine user display info
  const getDisplayName = () => {
    if (telegramUser?.username) {
      return telegramUser.username;
    } else if (telegramUser?.first_name) {
      return telegramUser.first_name;
    } else if (supabaseUser?.email) {
      return supabaseUser.email.split('@')[0];
    } else if (supabaseUser?.user_metadata?.full_name) {
      return supabaseUser.user_metadata.full_name;
    }
    return "User";
  };
  
  const getAvatarUrl = () => {
    if (telegramUser?.photo_url) {
      return telegramUser.photo_url;
    } else if (supabaseUser?.user_metadata?.avatar_url) {
      return supabaseUser.user_metadata.avatar_url;
    }
    return "";
  };

  const displayName = getDisplayName();
  const avatarUrl = getAvatarUrl();
  
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <Avatar className="w-11 h-11 mr-3 border-2 border-white shadow-sm">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-fipt-blue text-white">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-medium">{displayName}</h3>
          <p className="text-xs text-muted-foreground">
            {telegramUser ? 'Telegram User' : supabaseUser?.app_metadata?.provider === 'google' ? 'Google User' : 'Email User'}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className={`h-8 w-8 rounded-full ${isRefreshing ? 'animate-spin' : ''}`}
          title="Refresh balance"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onLogout}
          className="h-8 w-8 rounded-full bg-gray-50"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
