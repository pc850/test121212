
import { TelegramUser } from "@/types/telegram";

interface UserInfoBannerProps {
  currentUser: TelegramUser | null;
  supabaseUser: any;
  isLoggedIn: boolean;
}

const UserInfoBanner = ({ currentUser, supabaseUser, isLoggedIn }: UserInfoBannerProps) => {
  if (!isLoggedIn) return null;
  
  return (
    <div className="px-6 mt-2 mb-4">
      <div className="p-4 bg-gradient-to-r from-fipt-blue/10 to-fipt-accent/10 rounded-xl text-sm backdrop-blur-sm border border-fipt-blue/10 shadow-sm">
        {currentUser && (
          <div className="flex items-center">
            <span className="font-medium">Telegram: </span> 
            <span className="text-fipt-blue ml-2 font-medium">
              @{currentUser.username || currentUser.first_name}
            </span>
          </div>
        )}
        {supabaseUser && !currentUser && (
          <div className="flex items-center">
            <span className="font-medium">
              {supabaseUser.app_metadata?.provider === 'google' ? 'Google: ' : 'Email: '}
            </span> 
            <span className="text-fipt-blue ml-2 font-medium">
              {supabaseUser.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoBanner;
