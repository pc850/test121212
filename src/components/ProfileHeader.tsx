
import { Settings, Share2, Badge } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {/* Background with blur effect */}
      <div className="relative h-40 bg-gradient-to-r from-fipt-blue/20 to-fipt-accent/20 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md"></div>
        
        {/* Top actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-fipt-dark" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
            <Settings className="w-4 h-4 text-fipt-dark" />
          </button>
        </div>
      </div>
      
      {/* Profile info */}
      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
          <img 
            src={userAvatar} 
            alt={username} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* User info */}
        <div className="pt-16">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-fipt-dark">{username}</h1>
            <Badge className="w-4 h-4 text-fipt-blue" />
          </div>
          
          {bio && (
            <p className="mt-1 text-sm text-fipt-muted leading-snug">{bio}</p>
          )}
          
          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-fipt-dark">{points}</span>
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
