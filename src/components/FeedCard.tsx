
import { useState } from "react";
import { cn } from "@/lib/utils";
import CardHeader from "./feed/CardHeader";
import CardMedia from "./feed/CardMedia";
import CardActions from "./feed/CardActions";
import SwipeIndicator from "./feed/SwipeIndicator";
import BalanceDisplay from "./feed/BalanceDisplay";

interface FeedCardProps {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  video?: boolean;
  performerId?: string;
  youtubeVideoId?: string;
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
  performerId,
  youtubeVideoId,
  likes,
  comments,
  shares,
  isActive = false,
  balance = 0,
  onBalanceChange,
}: FeedCardProps) => {
  const [isLoading, setIsLoading] = useState(!!(image || video || youtubeVideoId));

  const handleMediaLoad = () => {
    setIsLoading(false);
  };

  const handleMediaClick = () => {
    window.open("https://onlyfans.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full max-w-md h-full rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 flex flex-col animate-fade-in relative">
      <div className="relative flex-grow overflow-hidden">
        <div className="cursor-pointer" onClick={handleMediaClick}>
          <CardMedia
            image={image}
            video={video}
            youtubeVideoId={youtubeVideoId}
            performerId={performerId}
            isActive={isActive}
            onMediaLoad={handleMediaLoad}
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/20 via-transparent to-black/40">
          <CardHeader username={username} userAvatar={userAvatar} />

          <div className="mt-auto">
            <p className="text-sm text-white drop-shadow-md mb-4 max-w-[80%]">{content}</p>
          </div>
        </div>

        <CardActions
          id={id}
          likes={likes}
          comments={comments}
          shares={shares}
          balance={balance}
          onBalanceChange={onBalanceChange}
        />

        <SwipeIndicator />
      </div>

      <BalanceDisplay balance={balance} />
    </div>
  );
};

export default FeedCard;
