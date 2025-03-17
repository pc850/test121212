
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut } from "lucide-react";
import { TelegramUser } from "@/types/telegram";

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
    return "https://i.pravatar.cc/150?img=5";
  };
  
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img 
            src={getAvatarUrl()} 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium">{getDisplayName()}</h3>
          <p className="text-xs text-muted-foreground">
            {telegramUser ? 'Telegram User' : supabaseUser?.app_metadata?.provider === 'google' ? 'Google User' : 'Email User'}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className={`h-8 w-8 ${isRefreshing ? 'animate-spin' : ''}`}
          title="Refresh balance"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="h-8 w-8"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
