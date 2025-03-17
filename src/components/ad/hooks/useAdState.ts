
import { useState, useEffect } from "react";

interface UseAdStateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
  onSuccess?: (points: number) => void;
  onSkip?: () => void;
}

export function useAdState({
  open,
  onOpenChange,
  points,
  onSuccess,
  onSkip
}: UseAdStateProps) {
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
    if (onSuccess) onSuccess(points);  // Pass the points to the success handler
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

  return {
    adPlaying,
    setAdPlaying,
    timeRemaining,
    setTimeRemaining,
    completed,
    setCompleted,
    adLoaded,
    setAdLoaded,
    handleStartAd,
    handleClaim,
    handleSkip,
    handleOpenChange
  };
}
