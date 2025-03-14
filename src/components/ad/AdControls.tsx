
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AdControlsProps {
  adPlaying: boolean;
  completed: boolean;
  timeRemaining: number;
  adLoaded: boolean;
  points: number;
  onStartAd: () => void;
  onClaim: () => void;
  onSkip: () => void;
}

export function AdControls({ 
  adPlaying,
  completed,
  points,
  onStartAd, 
  onClaim,
  onSkip 
}: AdControlsProps) {
  if (completed) {
    return (
      <Button 
        onClick={onClaim}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Claim {points} Points
      </Button>
    );
  }
  
  return (
    <>
      <Button 
        onClick={onStartAd}
        className="w-full"
        disabled={adPlaying}
      >
        Watch Ad to Claim FIPT
      </Button>
      
      <Button 
        onClick={onSkip}
        variant="ghost" 
        className="mt-2 text-fipt-muted"
        size="sm"
      >
        Skip <X className="ml-1 w-3 h-3" />
      </Button>
    </>
  );
}
