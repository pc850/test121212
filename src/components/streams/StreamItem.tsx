
import React, { useState, useEffect, useRef } from "react";
import { Stream } from "@/types/streams";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface StreamItemProps {
  stream: Stream;
  isLastElement: boolean;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

const StreamItem = ({ stream, isLastElement, lastElementRef }: StreamItemProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to create ad container with unique ID
  const createAdContainer = () => {
    if (!containerRef.current) return;
    
    // Clear previous content
    containerRef.current.innerHTML = '';
    
    // Create a unique ID for this ad container
    const containerId = `ad-container-${stream.id}-${Date.now()}`;
    const adContainer = document.createElement('div');
    adContainer.id = containerId;
    adContainer.className = 'w-full h-full flex items-center justify-center';
    
    // Append the container
    containerRef.current.appendChild(adContainer);
    
    return containerId;
  };
  
  // Function to load the Adsterra script
  const loadAdsterraScript = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Create fresh ad container
    createAdContainer();
    
    // Create and inject the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//harmlesstranquilizer.com/f2/ef/9a/f2ef9a7889efe0cfcbe5ce11992fa39b.js';
    script.async = true;
    
    script.onload = () => {
      console.log(`Ad script loaded for stream ${stream.id}`);
      setIsLoading(false);
    };
    
    script.onerror = (error) => {
      console.error(`Error loading ad script for stream ${stream.id}:`, error);
      setIsLoading(false);
      setHasError(true);
      toast({
        title: "Ad failed to load",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    };
    
    // Inject the script into the document body
    document.body.appendChild(script);
    
    return script;
  };
  
  // Load script when component mounts or stream changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    const script = loadAdsterraScript();
    
    // Cleanup function
    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [stream.id]);
  
  // Function to reload the ad
  const reloadAd = () => {
    // Remove any existing scripts with this source
    const existingScripts = document.querySelectorAll(`script[src*="harmlesstranquilizer.com"]`);
    existingScripts.forEach(script => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    });
    
    loadAdsterraScript();
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
                  e.currentTarget.src = "https://via.placeholder.com/400x300?text=Loading+Ad";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Loading ad content...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Loading ad content...</p>
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
            <h3 className="text-lg font-semibold mb-2">Ad Unavailable</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The ad content could not be loaded at this time.
            </p>
            <Button variant="outline" size="sm" onClick={reloadAd} className="inline-flex gap-2">
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Ad container - the script will populate this div */}
      <div className="w-full h-full"></div>
    </div>
  );
};

export default StreamItem;
