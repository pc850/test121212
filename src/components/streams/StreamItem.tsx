
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
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  // Reset states when stream changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [stream.id]);

  useEffect(() => {
    // Create and load the external script
    const loadScript = () => {
      if (scriptRef.current) {
        // Remove previous script if it exists
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//harmlesstranquilizer.com/f2/ef/9a/f2ef9a7889efe0cfcbe5ce11992fa39b.js';
      script.async = true;
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        console.error('Error loading external script');
      };

      document.body.appendChild(script);
      scriptRef.current = script;
    };

    loadScript();

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, [stream.id]);

  const reloadStream = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Clear the container and reload the script
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    // Re-inject the script with a new timestamp to force reload
    if (scriptRef.current) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//harmlesstranquilizer.com/f2/ef/9a/f2ef9a7889efe0cfcbe5ce11992fa39b.js?t=${Date.now()}`;
      script.async = true;
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        console.error('Error loading external script');
      };

      document.body.appendChild(script);
      scriptRef.current = script;
    }
  };

  return (
    <div
      ref={(node) => {
        // Set both refs - the lastElementRef for infinite scrolling and our containerRef
        if (isLastElement && lastElementRef) {
          lastElementRef(node);
        }
        containerRef.current = node;
      }}
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

      {/* The external script will populate this div */}
      <div className="stream-container w-full h-full"></div>
    </div>
  );
};

export default StreamItem;
