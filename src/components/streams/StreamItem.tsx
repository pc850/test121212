
import React, { useState } from "react";
import { Stream } from "@/types/streams";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface StreamItemProps {
  stream: Stream;
  isLastElement: boolean;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

const StreamItem = ({ stream, isLastElement, lastElementRef }: StreamItemProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const isMobile = useIsMobile();
  
  // Reset loading state when stream changes
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // For YouTube videos, we'll handle loading in the iframe onLoad
    if (!stream.youtubeId) {
      // For images, we'll start with loading state
      setShowVideo(false);
    } else {
      // For YouTube videos, we'll initialize to show the video
      setShowVideo(true);
    }
  }, [stream.id]);

  const refreshContent = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Reset loading state after a short delay
    setTimeout(() => {
      if (stream.youtubeId) {
        setShowVideo(true);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleImageClick = () => {
    if (stream.youtubeId) {
      setShowVideo(true);
    } else {
      window.open("https://onlyfans.com/", "_blank", "noopener,noreferrer");
    }
  };

  const handleMediaLoad = () => {
    setIsLoading(false);
    console.log(`Media loaded for stream ${stream.id}`);
  };

  const handleMediaError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error(`Error loading media for stream ${stream.id}`);
  };

  return (
    <div
      ref={isLastElement ? lastElementRef : null}
      className="h-screen relative"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Display the stream content */}
      <div className="w-full h-full">
        {stream.youtubeId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${stream.youtubeId}?autoplay=1&mute=${isMobile ? 1 : 0}&playsinline=1&controls=1&loop=1&rel=0&enablejsapi=1`}
            title={`YouTube video ${stream.room}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleMediaLoad}
            onError={handleMediaError}
          ></iframe>
        ) : stream.image ? (
          <img 
            src={stream.image} 
            alt={`Content for ${stream.room}`}
            className="w-full h-full object-cover cursor-pointer"
            onLoad={handleMediaLoad}
            onError={handleMediaError}
            onClick={handleImageClick}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-lg text-muted-foreground">No preview available</p>
          </div>
        )}
        
        {/* Overlay with stream info */}
        {(!stream.youtubeId || !showVideo) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-semibold">{stream.room}</h3>
            {stream.campaign && (
              <p className="text-white/80 text-sm">{stream.campaign}</p>
            )}
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
          <div className="w-16 h-16 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Loading content...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
          <div className="max-w-xs p-6 bg-card rounded-lg shadow-lg text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Content Unavailable</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The content could not be loaded at this time.
            </p>
            <Button variant="outline" size="sm" onClick={refreshContent} className="inline-flex gap-2">
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamItem;
