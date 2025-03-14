
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdContent } from "./AdContent";
import { AdControls } from "./AdControls";

interface AdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
  onSuccess?: () => void;
  onSkip?: () => void;
}

export function AdDialog({ open, onOpenChange, points, onSuccess, onSkip }: AdDialogProps) {
  const [adPlaying, setAdPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15); // 15 seconds
  const [completed, setCompleted] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setAdPlaying(false);
      setTimeRemaining(15);
      setCompleted(false);
      setAdLoaded(false);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    }
  }, [open]);

  // Handle countdown when ad is playing
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    
    if (adPlaying && timeRemaining > 0 && adLoaded) {
      // Only start countdown after video is loaded
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setAdPlaying(false);
            setCompleted(true);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = undefined;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [adPlaying, timeRemaining, adLoaded]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, []);

  const handleStartAd = () => {
    setAdPlaying(true);
    // Mark video as loaded immediately to start the timer
    // In a real implementation, you might want to listen for the iframe's load event
    setTimeout(() => {
      setAdLoaded(true);
    }, 1000);
  };

  const handleClaim = () => {
    // Here you would typically call an API to credit the points
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
    if (!open) {
      if (!completed) {
        // If closing without completing, treat as skip
        if (onSkip) onSkip();
      }
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
              : `Watch video for 15 seconds to claim ${points} FIPT points`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {adPlaying ? (
            <div className="w-full max-w-md h-96 mb-4 relative bg-black">
              {!adLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <iframe 
                ref={videoRef}
                src="https://www.tiktok.com/embed/v2/7338609783458565382"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="TikTok Video"
              ></iframe>
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                {adLoaded ? timeRemaining : "Loading..."}s
              </div>
            </div>
          ) : (
            <AdContent 
              adPlaying={adPlaying}
              completed={completed}
              timeRemaining={timeRemaining}
              adLoaded={adLoaded}
              onStartAd={handleStartAd}
            />
          )}
          
          <AdControls 
            adPlaying={adPlaying}
            completed={completed}
            timeRemaining={timeRemaining}
            adLoaded={adLoaded}
            points={points}
            onStartAd={handleStartAd}
            onClaim={handleClaim}
            onSkip={handleSkip}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
