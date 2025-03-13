
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import VideoPlayer from "./VideoPlayer";

interface AdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
  onSuccess?: () => void; // Callback for successful claim
  onSkip?: () => void; // Callback for when user skips
}

export function AdDialog({ open, onOpenChange, points, onSuccess, onSkip }: AdDialogProps) {
  const [adPlaying, setAdPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15); // 15 seconds
  const [completed, setCompleted] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const adContainerId = "ad_player_container";

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setAdPlaying(false);
      setTimeRemaining(15);
      setCompleted(false);
      setClaimed(false);
      setAdLoaded(false);
    }
  }, [open]);

  // Handle countdown when ad is playing
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (adPlaying && timeRemaining > 0 && adLoaded) {
      // Only start countdown after ad is loaded
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setAdPlaying(false);
            setCompleted(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [adPlaying, timeRemaining, adLoaded]);

  const handleStartAd = () => {
    setAdPlaying(true);
  };

  const handleAdLoaded = () => {
    console.log("Ad loaded successfully");
    setAdLoaded(true);
  };

  const handleClaim = () => {
    // Here you would typically call an API to credit the points
    setClaimed(true);
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };

  const handleSkip = () => {
    // Close the dialog without claiming any points
    if (onSkip) onSkip();
    onOpenChange(false);
  };

  // Handle dialog close via X button or ESC key
  const handleOpenChange = (open: boolean) => {
    if (!open && !claimed && !completed) {
      // If closing without claiming and without completing, treat as skip
      if (onSkip) onSkip();
    } else if (!open && completed && !claimed) {
      // If completed ad but closing without claiming, still treat as skip
      if (onSkip) onSkip();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {completed ? "Congratulations!" : "Earn FIPT Points"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {completed 
              ? `You've earned ${points} FIPT points!` 
              : `Watch content for 15 seconds to claim ${points} FIPT points`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {!completed ? (
            <>
              {adPlaying ? (
                <div className="w-full max-w-md h-64 mb-4 relative bg-black">
                  {!adLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <VideoPlayer 
                    containerId={adContainerId} 
                    width="100%" 
                    height="100%" 
                    onLoad={handleAdLoaded} 
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {adLoaded ? timeRemaining : "Loading..."}s
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-fipt-blue/10">
                  <Play className="w-10 h-10 text-fipt-blue" />
                </div>
              )}
              
              <Button 
                onClick={adPlaying ? undefined : handleStartAd}
                disabled={adPlaying} 
                className="w-full"
                variant={adPlaying ? "outline" : "default"}
              >
                {adPlaying ? (adLoaded ? `Watching content (${timeRemaining}s)...` : "Loading content...") : "Watch Content"}
              </Button>
              
              {!adPlaying && (
                <Button 
                  onClick={handleSkip}
                  variant="ghost" 
                  className="mt-2 text-fipt-muted"
                  size="sm"
                >
                  Skip <X className="ml-1 w-3 h-3" />
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <Button 
                onClick={handleClaim}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Claim {points} Points
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
