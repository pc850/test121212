
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
  const [claimed, setClaimed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const adScriptRef = useRef<HTMLScriptElement | null>(null);

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setAdPlaying(false);
      setTimeRemaining(15);
      setCompleted(false);
      setClaimed(false);
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
      // Only start countdown after ad is loaded
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
      
      // Clean up any adsterra script
      if (adScriptRef.current && document.body.contains(adScriptRef.current)) {
        document.body.removeChild(adScriptRef.current);
        adScriptRef.current = null;
      }
    };
  }, []);

  const handleStartAd = () => {
    setAdPlaying(true);
    
    // Load Adsterra script when user clicks "Watch Content"
    if (!adScriptRef.current) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//harmlesstranquilizer.com/f2/ef/9a/f2ef9a7889efe0cfcbe5ce11992fa39b.js';
      script.async = true;
      
      // Set up load handler
      script.onload = () => {
        console.log("Adsterra script loaded");
        setAdLoaded(true);
      };
      
      // Set up error handler
      script.onerror = () => {
        console.error("Failed to load Adsterra script");
        // Fallback to continue the flow even if ad fails
        setAdLoaded(true);
      };
      
      // Store reference for cleanup
      adScriptRef.current = script;
      
      // Append to document body
      document.body.appendChild(script);
    } else {
      // If script already exists, just mark as loaded
      setAdLoaded(true);
    }
  };

  const handleClaim = () => {
    // Here you would typically call an API to credit the points
    setClaimed(true);
    if (onSuccess) onSuccess();
    
    // Clean up adsterra script on claim
    if (adScriptRef.current && document.body.contains(adScriptRef.current)) {
      document.body.removeChild(adScriptRef.current);
      adScriptRef.current = null;
    }
    
    onOpenChange(false);
  };

  const handleSkip = () => {
    // Clean up adsterra script on skip
    if (adScriptRef.current && document.body.contains(adScriptRef.current)) {
      document.body.removeChild(adScriptRef.current);
      adScriptRef.current = null;
    }
    
    // Close the dialog without claiming any points
    if (onSkip) onSkip();
    onOpenChange(false);
  };

  // Handle dialog close via X button or ESC key
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Clean up adsterra script on dialog close
      if (adScriptRef.current && document.body.contains(adScriptRef.current)) {
        document.body.removeChild(adScriptRef.current);
        adScriptRef.current = null;
      }
      
      if (!claimed && !completed) {
        // If closing without claiming and without completing, treat as skip
        if (onSkip) onSkip();
      } else if (completed && !claimed) {
        // If completed ad but closing without claiming, still treat as skip
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
              : `Watch content for 15 seconds to claim ${points} FIPT points`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <AdContent 
            adPlaying={adPlaying}
            completed={completed}
            timeRemaining={timeRemaining}
            adLoaded={adLoaded}
            onStartAd={handleStartAd}
          />
          
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
