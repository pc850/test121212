
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
}

export function AdDialog({ open, onOpenChange, points }: AdDialogProps) {
  const [adPlaying, setAdPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [completed, setCompleted] = useState(false);

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setAdPlaying(false);
      setTimeRemaining(30);
      setCompleted(false);
    }
  }, [open]);

  // Handle countdown when ad is playing
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (adPlaying && timeRemaining > 0) {
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
  }, [adPlaying, timeRemaining]);

  const handleStartAd = () => {
    setAdPlaying(true);
  };

  const handleClaim = () => {
    // Here you would typically call an API to credit the points
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {completed ? "Congratulations!" : "Earn FIPT Points"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {completed 
              ? `You've earned ${points} FIPT points!` 
              : `Watch a 30-second ad to claim ${points} FIPT points`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {!completed ? (
            <>
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center mb-4",
                adPlaying 
                  ? "bg-gray-100 animate-pulse" 
                  : "bg-fipt-blue/10"
              )}>
                {adPlaying ? (
                  <span className="text-2xl font-bold text-fipt-dark">{timeRemaining}</span>
                ) : (
                  <Play className="w-10 h-10 text-fipt-blue" />
                )}
              </div>
              
              <Button 
                onClick={adPlaying ? undefined : handleStartAd}
                disabled={adPlaying} 
                className="w-full"
                variant={adPlaying ? "outline" : "default"}
              >
                {adPlaying ? `Watching ad (${timeRemaining}s)...` : "Watch Ad"}
              </Button>
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
