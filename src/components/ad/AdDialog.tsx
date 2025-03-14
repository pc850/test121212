
import { useState } from "react";
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
  const [completed, setCompleted] = useState(false);

  const handleStartAd = () => {
    // Simulate ad completion instantly
    setCompleted(true);
  };

  const handleClaim = () => {
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {completed ? "Congratulations!" : "Earn FIPT Points"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {completed 
              ? `You've earned ${points} FIPT points!` 
              : `Get ${points} FIPT points instantly!`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <AdContent 
            adPlaying={false}
            completed={completed}
            timeRemaining={0}
            adLoaded={true}
            onStartAd={handleStartAd}
          />
          
          <AdControls 
            adPlaying={false}
            completed={completed}
            timeRemaining={0}
            adLoaded={true}
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
