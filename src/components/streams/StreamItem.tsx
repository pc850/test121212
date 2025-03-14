
import React, { useState, useEffect, useRef } from "react";
import { Stream } from "@/types/streams";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StreamItemProps {
  stream: Stream;
  isLastElement: boolean;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

const StreamItem = ({ stream, isLastElement, lastElementRef }: StreamItemProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Reset states when stream changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [stream.id]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error(`Error loading stream for ${stream.room}`);
  };
  
  const reloadStream = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Add timestamp to force reload and bypass cache
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = currentSrc.includes('?') 
        ? `${currentSrc}&_t=${Date.now()}` 
        : `${currentSrc}?_t=${Date.now()}`;
    }
  };

  // Create a properly formatted embed URL
  const embedUrl = `https://chaturbate.com/embed/${stream.room}/?campaign=${stream.campaign}&disable_sound=0&mobileRedirect=never&disable_ads=0&c=226666&room_name=${stream.room}&t=${Date.now()}`;

  return (
    <div
      ref={isLastElement ? lastElementRef : null}
      className="h-screen relative"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          {stream.image ? (
            <div className="relative w-full h-full">
              <img 
                src={stream.image} 
                alt={`Preview of ${stream.room}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails, set a fallback
                  e.currentTarget.src = "https://via.placeholder.com/400x300?text=Loading+Stream";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Loading stream...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Loading stream...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
          <div className="max-w-xs p-6 bg-card rounded-lg shadow-lg text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Stream Unavailable</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This stream might be offline or unavailable right now.
            </p>
            <Button variant="outline" size="sm" onClick={reloadStream} className="inline-flex gap-2">
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full border-none"
        allowFullScreen
        title={`Live Stream - ${stream.room}`}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      />
    </div>
  );
};

export default StreamItem;
