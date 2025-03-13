
import React, { useState } from "react";
import { Stream } from "@/types/streams";
import { Skeleton } from "@/components/ui/skeleton";

interface StreamItemProps {
  stream: Stream;
  isLastElement: boolean;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

const StreamItem = ({ stream, isLastElement, lastElementRef }: StreamItemProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={isLastElement ? lastElementRef : null}
      className="h-screen relative"
      style={{
        scrollSnapAlign: 'start',
      }}
    >
      {/* Preview image or loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          {stream.image ? (
            <div className="relative w-full h-full">
              <img 
                src={stream.image} 
                alt={`Preview of ${stream.room}`}
                className="w-full h-full object-cover"
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

      <iframe
        src={`https://chaturbate.com/in/?tour=eQof&campaign=${stream.campaign}&track=default&signup_notice=1&b=${stream.room}`}
        className="w-full h-full border-none"
        allowFullScreen
        title={`Live Stream - ${stream.room}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default StreamItem;
