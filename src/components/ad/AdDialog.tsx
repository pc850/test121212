
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdContent } from "./AdContent";
import { AdControls } from "./AdControls";
import { AdVideoPlayer } from "./AdVideoPlayer";
import { AdCountdown } from "./AdCountdown";
import { useAdState } from "./hooks/useAdState";

interface AdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
  onSuccess?: (points: number) => void;
  onSkip?: () => void;
}

export function AdDialog({ open, onOpenChange, points, onSuccess, onSkip }: AdDialogProps) {
  const {
    adPlaying, setAdPlaying,
    timeRemaining, setTimeRemaining,
    completed, setCompleted,
    adLoaded, setAdLoaded,
    handleStartAd,
    handleClaim,
    handleSkip,
    handleOpenChange
  } = useAdState({
    open,
    onOpenChange,
    points,
    onSuccess,
    onSkip
  });

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
