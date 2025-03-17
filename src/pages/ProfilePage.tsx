
import { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import UserProfileSection from "@/components/UserProfileSection";
import LoginSection from "@/components/profile/LoginSection";
import UserInfoBanner from "@/components/profile/UserInfoBanner";
import ProfileTabs from "@/components/profile/ProfileTabs";

const ProfilePage = () => {
  const { currentUser, supabaseUser, autoLogin, logout, getDisplayName, isLoggedIn } = useTelegramAuth();
  const [username, setUsername] = useState("crypto_user");
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "FIPT - Profile";
    
    // Try to auto-login
    autoLogin();
  }, [autoLogin]);

  // Update username if we have a user from any source
  useEffect(() => {
    if (isLoggedIn) {
      setUsername(getDisplayName());
    }
  }, [currentUser, supabaseUser, getDisplayName, isLoggedIn]);

  const getUserAvatar = () => {
    if (currentUser?.photo_url) {
      return currentUser.photo_url;
    } else if (supabaseUser?.user_metadata?.avatar_url) {
      return supabaseUser.user_metadata.avatar_url;
    }
    return "https://i.pravatar.cc/150?img=5";
  };

  const getUserBio = () => {
    if (currentUser) {
      return `Telegram: @${currentUser.username || currentUser.first_name}`;
    } else if (supabaseUser) {
      if (supabaseUser.app_metadata?.provider === 'google') {
        return `Google: ${supabaseUser.email}`;
      }
      return `Email: ${supabaseUser.email}`;
    }
    return "FIPT enthusiast | Crypto lover | Web3 explorer";
  };

  const handleLoginSuccess = () => {
    setShowLoginOptions(false);
    autoLogin();
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in bg-gradient-to-b from-white to-gray-50">
      {/* Profile Header */}
      <div className="flex flex-col">
        <ProfileHeader 
          username={username}
          userAvatar={getUserAvatar()}
          points={1250}
          followers={142}
          following={35}
          bio={getUserBio()}
        />
        
        {/* Connect Wallet Button or User Profile Section */}
        <div className="px-6 pb-2 flex justify-between -mt-2">
          {isLoggedIn ? (
            <div className="flex gap-2 w-full">
              <UserProfileSection onLogout={logout} />
            </div>
          ) : (
            <LoginSection 
              showLoginOptions={showLoginOptions}
              setShowLoginOptions={setShowLoginOptions}
              onLoginSuccess={handleLoginSuccess}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      </div>
      
      {/* User Info Banner */}
      <UserInfoBanner 
        currentUser={currentUser}
        supabaseUser={supabaseUser}
        isLoggedIn={isLoggedIn}
      />
      
      {/* Tabs Section */}
      <div className="flex-1 px-4 mt-4 pb-20">
        <ProfileTabs />
      </div>
    </div>
  );
};

export default ProfilePage;
