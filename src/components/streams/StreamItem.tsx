
import React, { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Simple function to simulate loading content (if needed in the future)
  const refreshContent = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      ref={isLastElement ? lastElementRef : null}
      className="h-screen relative"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Display the stream image or a placeholder */}
      <div className="w-full h-full">
        {stream.image ? (
          <img 
            src={stream.image} 
            alt={`Content for ${stream.room}`}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-lg text-muted-foreground">No preview available</p>
          </div>
        )}
        
        {/* Overlay with stream info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-semibold">{stream.room}</h3>
          {stream.campaign && (
            <p className="text-white/80 text-sm">{stream.campaign}</p>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
          <Skeleton className="w-16 h-16 rounded-full" />
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
