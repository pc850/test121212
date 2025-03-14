
import { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import VideoPlayer from "../VideoPlayer";
import { useIsMobile } from "@/hooks/use-mobile";

interface CardMediaProps {
  image?: string;
  video?: boolean;
  youtubeVideoId?: string;
  performerId?: string;
  isActive: boolean;
  onMediaLoad: () => void;
}

const CardMedia = ({
  image,
  video = false,
  youtubeVideoId,
  performerId,
  isActive,
  onMediaLoad,
}: CardMediaProps) => {
  const [isLoading, setIsLoading] = useState(!!(image || video || youtubeVideoId));
  const [videoReady, setVideoReady] = useState(false);
  const playerId = `player_container_${performerId || youtubeVideoId || "default"}`;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isActive && (image || video || youtubeVideoId)) {
      setIsLoading(true);
      if (!video && !youtubeVideoId) {
      } else {
        setVideoReady(false);
      }
    } else if (!isActive && (video || youtubeVideoId)) {
      setVideoReady(false);
    }
  }, [isActive, image, video, youtubeVideoId]);

  const handleImageLoad = () => {
    setIsLoading(false);
    onMediaLoad();
  };

  const handleVideoLoad = () => {
    console.log(`Video loaded for player ${playerId}`);
    setVideoReady(true);
    setIsLoading(false);
    onMediaLoad();
  };

  return (
    <div className="absolute inset-0 bg-fipt-gray">
      {(isLoading || (!videoReady && (video || youtubeVideoId))) && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {image && !video && !youtubeVideoId && (
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
      )}

      {video && !youtubeVideoId && isActive && (
        <div className={cn(
          "w-full h-full transition-opacity duration-300",
          videoReady ? "opacity-100" : "opacity-0"
        )}>
          <VideoPlayer 
            containerId={playerId} 
            onLoad={handleVideoLoad}
            performerId={performerId}
          />
        </div>
      )}

      {youtubeVideoId && isActive && (
        <div className={cn(
          "w-full h-full transition-opacity duration-300",
          videoReady ? "opacity-100" : "opacity-0"
        )}>
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=${isMobile ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${youtubeVideoId}&enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              handleVideoLoad();
            }}
          ></iframe>
        </div>
      )}

      {video && (
        <div className="absolute top-4 right-4 z-10">
          <Video className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default CardMedia;
