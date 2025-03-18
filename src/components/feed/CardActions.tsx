
import { useState } from "react";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CardActionsProps {
  id: string;
  likes: number;
  comments: number;
  shares: number;
  balance: number;
  onBalanceChange?: (amount: number) => void;
}

const CardActions = ({
  id,
  likes,
  comments,
  shares,
  balance,
  onBalanceChange,
}: CardActionsProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

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
        title: "Not enough TEST",
        description: "You need at least 11 TEST tokens to like this post",
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
      description: `Used 1 TEST token. ${balance - 1} tokens remaining.`,
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

  return (
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
  );
};

export default CardActions;
