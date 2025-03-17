
import { Settings, Share2, Badge } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  username: string;
  userAvatar: string;
  points: number;
  followers: number;
  following: number;
  bio?: string;
}

const ProfileHeader = ({
  username,
  userAvatar,
  points,
  followers,
  following,
  bio
}: ProfileHeaderProps) => {
  return (
    <div className="w-full animate-slide-down">
      {/* Background with gradient effect */}
      <div className="relative h-48 bg-gradient-to-r from-fipt-blue/30 to-fipt-accent/30 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md"></div>
        
        {/* Top actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
            <Share2 className="w-4 h-4 text-fipt-dark" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
            <Settings className="w-4 h-4 text-fipt-dark" />
          </button>
        </div>
      </div>
      
      {/* Profile info */}
      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-6 w-28 h-28 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={userAvatar} 
              alt={username}
              className="object-cover"
            />
            <AvatarFallback className="bg-fipt-blue text-white text-xl">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* User info */}
        <div className="pt-20">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-fipt-dark">{username}</h1>
            <Badge className="w-4 h-4 text-fipt-blue" />
          </div>
          
          {bio && (
            <p className="mt-1 text-sm text-fipt-muted leading-snug">{bio}</p>
          )}
          
          {/* Stats */}
          <div className="flex items-center gap-8 mt-5 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-fipt-blue">{points}</span>
              <span className="text-xs text-fipt-muted">Points</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-fipt-dark">{followers}</span>
              <span className="text-xs text-fipt-muted">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-fipt-dark">{following}</span>
              <span className="text-xs text-fipt-muted">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
