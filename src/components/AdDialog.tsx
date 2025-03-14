
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const adContainerRef = useRef<HTMLDivElement>(null);
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
    
    // Create a container for the ad if it doesn't exist
    if (adContainerRef.current) {
      // Clear previous content
      adContainerRef.current.innerHTML = '';
      
      // Create ad container div
      const adDiv = document.createElement('div');
      adDiv.id = 'atContainer';
      adContainerRef.current.appendChild(adDiv);
      
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
          {!completed ? (
            <>
              {adPlaying ? (
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
