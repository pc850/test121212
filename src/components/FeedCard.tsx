import { useState, useEffect, useRef } from "react";
import { Heart, MessageSquare, Share2, ChevronUp, ChevronDown, Bookmark, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VideoPlayer";

interface FeedCardProps {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  video?: boolean;
  likes: number;
  comments: number;
  shares: number;
  isActive?: boolean;
  balance?: number;
  onBalanceChange?: (amount: number) => void;
}

const FeedCard = ({
  id,
  username,
  userAvatar,
  content,
  image,
  video = false,
  likes,
  comments,
  shares,
  isActive = false,
  balance = 0,
  onBalanceChange,
}: FeedCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(!!(image || video));
  const [saved, setSaved] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { toast } = useToast();
  const playerContainerId = `player_container_${id}`;
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && (image || video)) {
      setIsLoading(true);
      if (!video) {
      } else {
        setVideoReady(false);
      }
    } else if (!isActive && video) {
      setVideoReady(false);
    }
  }, [isActive, image, video]);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
      setLiked(false);
      toast({
        title: "Like removed",
        description: "You've removed your like from this post",
      });
      return;
    }
    
    if (balance < 11) {
      toast({
        title: "Not enough FIPT",
        description: "You need at least 11 FIPT tokens to like this post",
        variant: "destructive",
      });
      return;
    }
    
    if (onBalanceChange) {
      onBalanceChange(-1);
    }
    
    setLikeCount(prev => prev + 1);
    setLiked(true);
    
    toast({
      title: "Like added",
      description: `Used 1 FIPT token. ${balance - 1} tokens remaining.`,
    });
  };

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Share feature coming soon!",
    });
  };

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Removed from favorites" : "Saved to favorites",
      description: saved ? "Post removed from your favorites" : "Post added to your favorites",
    });
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    console.log(`Video loaded for player ${playerContainerId}`);
    setVideoReady(true);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md h-full rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 flex flex-col animate-fade-in relative">
      <div className="relative flex-grow overflow-hidden">
        {image && !video && (
          <div className="absolute inset-0 bg-fipt-gray">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
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

        {video && (
          <div className="absolute inset-0 bg-fipt-gray">
            {(isLoading || !videoReady) && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {isActive && (
              <div className={cn(
                "w-full h-full transition-opacity duration-300",
                videoReady ? "opacity-100" : "opacity-0"
              )}>
                <VideoPlayer 
                  containerId={playerContainerId} 
                  onLoad={handleVideoLoad}
                />
              </div>
            )}
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/20 via-transparent to-black/40">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img 
                src={userAvatar} 
                alt={username} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-white drop-shadow-md">{username}</h3>
              <p className="text-xs text-white/80 drop-shadow-sm">FIPT Community</p>
            </div>
            {video && (
              <div className="ml-auto">
                <Video className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          <div className="mt-auto">
            <p className="text-sm text-white drop-shadow-md mb-4 max-w-[80%]">{content}</p>
          </div>
        </div>

        <div className="absolute right-4 bottom-16 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <button 
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110",
                balance >= 11 || liked ? "bg-black/30" : "bg-black/10"
              )}
              onClick={handleLike}
              aria-label={liked ? "Unlike post" : "Like post"}
              disabled={balance < 11 && !liked}
            >
              <Heart 
                className={cn(
                  "w-6 h-6 transition-all",
                  liked ? "fill-red-500 text-red-500" : balance >= 11 ? "text-white" : "text-white/50"
                )} 
              />
            </button>
            <span className="text-xs font-medium text-white mt-1 drop-shadow-md">{likeCount}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <button 
              className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110"
              onClick={handleComment}
              aria-label="Comment on post"
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </button>
            <span className="text-xs font-medium text-white mt-1 drop-shadow-md">{comments}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <button 
              className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110"
              onClick={handleShare}
              aria-label="Share post"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <span className="text-xs font-medium text-white mt-1 drop-shadow-md">{shares}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <button 
              className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110"
              onClick={handleSave}
              aria-label={saved ? "Remove from favorites" : "Save to favorites"}
            >
              <Bookmark 
                className={cn(
                  "w-6 h-6 transition-all",
                  saved ? "fill-white text-white" : "text-white"
                )} 
              />
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center gap-1">
          <ChevronUp className="w-5 h-5 text-white/70" />
          <span className="text-xs text-white/70">Swipe</span>
          <ChevronDown className="w-5 h-5 text-white/70" />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <span className={cn(
          "px-3 py-1 rounded-full backdrop-blur-sm text-xs font-medium text-white drop-shadow-md",
          balance >= 11 ? "bg-black/30" : "bg-red-500/50"
        )}>
          {balance} FIPT
        </span>
      </div>
    </div>
  );
};

export default FeedCard;
