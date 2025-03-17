
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
      <div className="p-3 bg-fipt-blue/10 rounded-lg text-sm">
        {currentUser && (
          <>
            <span className="font-medium">Telegram: </span> 
            <span className="text-fipt-blue">
              @{currentUser.username || currentUser.first_name}
            </span>
          </>
        )}
        {supabaseUser && !currentUser && (
          <>
            <span className="font-medium">
              {supabaseUser.app_metadata?.provider === 'google' ? 'Google: ' : 'Email: '}
            </span> 
            <span className="text-fipt-blue">
              {supabaseUser.email}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfoBanner;
