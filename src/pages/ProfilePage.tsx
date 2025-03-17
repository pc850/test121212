
import { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import LeaderboardSection from "@/components/LeaderboardSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, ChevronRight, BarChart3, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import TonConnectButton from "@/components/TonConnectButton";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import UserProfileSection from "@/components/UserProfileSection";

const ProfilePage = () => {
  const { currentUser, autoLogin, logout } = useTelegramAuth();
  const [username, setUsername] = useState("crypto_user");

  useEffect(() => {
    // Set page title
    document.title = "FIPT - Profile";
    
    // Try to auto-login with Telegram
    autoLogin();
  }, [autoLogin]);

  // Update username if we have a Telegram user
  useEffect(() => {
    if (currentUser?.username) {
      setUsername(currentUser.username);
    } else if (currentUser?.first_name) {
      setUsername(currentUser.first_name);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Profile Header */}
      <div className="flex flex-col">
        <ProfileHeader 
          username={username}
          userAvatar={currentUser?.photo_url || "https://i.pravatar.cc/150?img=5"}
          points={1250}
          followers={142}
          following={35}
          bio={currentUser ? `Telegram: @${currentUser.username || currentUser.first_name}` : "FIPT enthusiast | Crypto lover | Web3 explorer"}
        />
        
        {/* Connect Wallet Button or User Profile Section */}
        <div className="px-6 pb-2 flex justify-end -mt-2">
          {currentUser ? (
            <UserProfileSection onLogout={logout} />
          ) : (
            <TonConnectButton />
          )}
        </div>
      </div>
      
      {/* Telegram User Info */}
      {currentUser && (
        <div className="px-6 mt-2 mb-4">
          <div className="p-3 bg-fipt-blue/10 rounded-lg text-sm">
            <span className="font-medium">Telegram: </span> 
            <span className="text-fipt-blue">
              @{currentUser.username || currentUser.first_name}
            </span>
          </div>
        </div>
      )}
      
      {/* Tabs Section */}
      <div className="flex-1 px-4 mt-4">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-10 bg-fipt-gray rounded-lg p-0.5">
            <TabsTrigger value="stats" className="rounded-md text-xs">Stats</TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-md text-xs">Achievements</TabsTrigger>
            <TabsTrigger value="friends" className="rounded-md text-xs">Friends</TabsTrigger>
          </TabsList>
          
          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-4">
            <div className="space-y-4">
              {/* Chart Card */}
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-fipt-dark">Earning History</h3>
                  <BarChart3 className="w-4 h-4 text-fipt-muted" />
                </div>
                
                {/* Simple chart visualization */}
                <div className="h-32 flex items-end gap-2">
                  {[35, 50, 40, 70, 45, 60, 80].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-fipt-blue/20 rounded-sm"
                        style={{ height: `${height}%` }}
                      >
                        <div 
                          className="w-full bg-fipt-blue rounded-sm transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-xs text-fipt-muted">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-medium text-fipt-muted mb-1">Total Earned</h3>
                  <p className="text-xl font-bold text-fipt-dark">12,450</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-medium text-fipt-muted mb-1">Current Streak</h3>
                  <p className="text-xl font-bold text-fipt-dark">7 days</p>
                </div>
              </div>
              
              {/* Leaderboard Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-fipt-dark">Leaderboard</h3>
                  <Users className="w-4 h-4 text-fipt-muted" />
                </div>
                <LeaderboardSection />
              </div>
              
              {/* Settings options */}
              <div className="space-y-2 mt-6">
                <button className="w-full p-3 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-fipt-gray flex items-center justify-center mr-3">
                      <Settings className="w-4 h-4 text-fipt-dark" />
                    </div>
                    <span className="text-sm font-medium text-fipt-dark">Account Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-fipt-muted" />
                </button>
              </div>
            </div>
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-4">
            <div className="space-y-3">
              {[
                { title: "Early Adopter", description: "Joined during beta phase", progress: 100, icon: Award },
                { title: "Point Collector", description: "Earn 1,000 FIPT points", progress: 80, icon: Award },
                { title: "Social Butterfly", description: "Connect with 10 friends", progress: 60, icon: Users },
                { title: "Daily Dedication", description: "Login for 7 consecutive days", progress: 100, icon: Award },
              ].map((achievement, index) => (
                <div key={index} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center">
                  <div className="w-10 h-10 rounded-full bg-fipt-gray flex items-center justify-center mr-3">
                    <achievement.icon className="w-5 h-5 text-fipt-dark" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-fipt-dark">{achievement.title}</h3>
                    <p className="text-xs text-fipt-muted">{achievement.description}</p>
                    <div className="w-full h-1.5 bg-fipt-gray rounded-full mt-2">
                      <div 
                        className="h-full bg-fipt-blue rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-fipt-muted ml-3">{achievement.progress}%</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Friends Tab */}
          <TabsContent value="friends" className="mt-4">
            <div className="space-y-3">
              {[
                { name: "alex_crypto", avatar: "https://i.pravatar.cc/150?img=1", status: "online" },
                { name: "crypto_whale", avatar: "https://i.pravatar.cc/150?img=2", status: "offline" },
                { name: "blockchain_dev", avatar: "https://i.pravatar.cc/150?img=3", status: "online" },
                { name: "defi_guru", avatar: "https://i.pravatar.cc/150?img=4", status: "offline" },
              ].map((friend, index) => (
                <div key={index} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-white",
                      friend.status === "online" ? "bg-green-500" : "bg-gray-300"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-fipt-dark">{friend.name}</h3>
                    <p className="text-xs text-fipt-muted capitalize">{friend.status}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-fipt-gray text-xs font-medium text-fipt-dark">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
