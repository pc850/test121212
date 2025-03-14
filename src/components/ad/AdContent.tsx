
import { useState, useEffect, useRef } from "react";
import { Play, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdContentProps {
  adPlaying: boolean;
  completed: boolean;
  timeRemaining: number;
  adLoaded: boolean;
  onStartAd: () => void;
}

export function AdContent({ 
  adPlaying, 
  completed, 
  timeRemaining, 
  adLoaded, 
  onStartAd 
}: AdContentProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  
  // Clean up when component unmounts or when adPlaying changes
  useEffect(() => {
    return () => {
      // Clean up any content in the ad container
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, [adPlaying]);
  
  if (completed) {
    return (
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check className="w-10 h-10 text-green-600" />
      </div>
    );
  }
  
  if (adPlaying) {
    return (
      <div className="w-full max-w-md h-64 mb-4 relative bg-black">
        {!adLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div 
          ref={adContainerRef} 
          className="w-full h-full"
        ></div>
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
          {adLoaded ? timeRemaining : "Loading..."}s
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-fipt-blue/10">
      <Play className="w-10 h-10 text-fipt-blue" />
    </div>
  );
}
