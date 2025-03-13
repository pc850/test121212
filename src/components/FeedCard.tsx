
import { useState } from "react";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedCardProps {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

const FeedCard = ({
  id,
  username,
  userAvatar,
  content,
  image,
  likes,
  comments,
  shares,
}: FeedCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(!!image);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 animate-slide-up mb-4">
      {/* Header */}
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <img 
            src={userAvatar} 
            alt={username} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-fipt-dark">{username}</h3>
          <p className="text-xs text-fipt-muted">FIPT Community</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-fipt-dark">{content}</p>
      </div>

      {/* Image (if any) */}
      {image && (
        <div className="relative w-full aspect-video bg-fipt-gray">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={image}
            alt="Post content"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            loading="lazy"
            onLoad={handleImageLoad}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <button 
          className="flex items-center gap-1"
          onClick={handleLike}
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all",
              liked ? "fill-red-500 text-red-500" : "text-fipt-muted"
            )} 
          />
          <span className="text-xs font-medium text-fipt-muted">{likeCount}</span>
        </button>
        
        <button className="flex items-center gap-1">
          <MessageSquare className="w-5 h-5 text-fipt-muted" />
          <span className="text-xs font-medium text-fipt-muted">{comments}</span>
        </button>
        
        <button className="flex items-center gap-1">
          <Share2 className="w-5 h-5 text-fipt-muted" />
          <span className="text-xs font-medium text-fipt-muted">{shares}</span>
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
