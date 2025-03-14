import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdContent } from "./AdContent";
import { AdControls } from "./AdControls";
import { AdVideoPlayer } from "./AdVideoPlayer";
import { AdCountdown } from "./AdCountdown";

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

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setAdPlaying(false);
      setTimeRemaining(15);
      setCompleted(false);
      setAdLoaded(false);
    }
  }, [open]);

  const handleStartAd = () => {
    setAdPlaying(true);
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
              : `Watch ad to claim ${points} FIPT points`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {adPlaying ? (
            <div className="w-full max-w-md h-96 mb-4 relative bg-black">
              <AdVideoPlayer 
                adPlaying={adPlaying} 
                adLoaded={adLoaded} 
                setAdLoaded={setAdLoaded} 
              />
              <AdCountdown 
                timeRemaining={timeRemaining}
                adPlaying={adPlaying}
                adLoaded={adLoaded}
                setTimeRemaining={setTimeRemaining}
                setAdPlaying={setAdPlaying}
                setCompleted={setCompleted}
              />
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
