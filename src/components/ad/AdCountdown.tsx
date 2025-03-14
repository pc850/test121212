
import { useEffect, useRef } from "react";

interface AdCountdownProps {
  timeRemaining: number;
  adPlaying: boolean;
  adLoaded: boolean;
  setTimeRemaining: (value: React.SetStateAction<number>) => void;
  setAdPlaying: (value: boolean) => void;
  setCompleted: (value: boolean) => void;
}

export function AdCountdown({ 
  timeRemaining, 
  adPlaying, 
  adLoaded,
  setTimeRemaining,
  setAdPlaying,
  setCompleted
}: AdCountdownProps) {
  const timerRef = useRef<ReturnType<typeof setInterval>>();

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
  }, [adPlaying, timeRemaining, adLoaded, setTimeRemaining, setAdPlaying, setCompleted]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, []);

  if (!adPlaying) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
      {adLoaded ? timeRemaining : "Loading..."}s
    </div>
  );
}
