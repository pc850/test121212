
import { useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, ChevronUp, ChevronDown, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FeedCardProps {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isActive?: boolean;
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
  isActive = false,
}: FeedCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(!!image);
  const [tokens, setTokens] = useState(10); // Starting with 10 tokens
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  // Reset loading state when active changes
  useEffect(() => {
    if (isActive && image) {
      setIsLoading(true);
    }
  }, [isActive, image]);

  const handleLike = () => {
    // If already liked, unlike without cost
    if (liked) {
      setLikeCount(prev => prev - 1);
      setLiked(false);
      return;
    }
    
    // Check if user has enough tokens
    if (tokens < 1) {
      toast({
        title: "Not enough tokens",
        description: "You need 1 token to like this post",
        variant: "destructive",
      });
      return;
    }
    
    // Deduct token and like the post
    setTokens(prev => prev - 1);
    setLikeCount(prev => prev + 1);
    setLiked(true);
    
    toast({
      title: "Like added",
      description: `Used 1 token. ${tokens - 1} tokens remaining.`,
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

  return (
    <div className="w-full max-w-md h-full rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 flex flex-col animate-fade-in relative">
      {/* Content container */}
      <div className="relative flex-grow overflow-hidden">
        {/* Image (if any) */}
        {image && (
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

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/20 via-transparent to-black/40">
          {/* Header */}
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
          </div>

          {/* Footer content */}
          <div className="mt-auto">
            <p className="text-sm text-white drop-shadow-md mb-4 max-w-[80%]">{content}</p>
          </div>
        </div>

        {/* Side actions */}
        <div className="absolute right-4 bottom-16 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <button 
              className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110"
              onClick={handleLike}
            >
              <Heart 
                className={cn(
                  "w-6 h-6 transition-all",
                  liked ? "fill-red-500 text-red-500" : "text-white"
                )} 
              />
            </button>
            <span className="text-xs font-medium text-white mt-1 drop-shadow-md">{likeCount}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110">
              <MessageSquare className="w-6 h-6 text-white" />
            </button>
            <span className="text-xs font-medium text-white mt-1 drop-shadow-md">{comments}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110">
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <span className="text-xs font-medium text-white mt-1 drop-shadow-md">{shares}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <button 
              className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110"
              onClick={handleSave}
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

        {/* Navigation hints */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center gap-1">
          <ChevronUp className="w-5 h-5 text-white/70" />
          <span className="text-xs text-white/70">Swipe</span>
          <ChevronDown className="w-5 h-5 text-white/70" />
        </div>
      </div>

      {/* Tokens indicator */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs font-medium text-white drop-shadow-md">
          {tokens} tokens
        </span>
      </div>
    </div>
  );
};

export default FeedCard;
