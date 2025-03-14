
import { Check, Play } from "lucide-react";

interface AdContentProps {
  adPlaying: boolean;
  completed: boolean;
  timeRemaining: number;
  adLoaded: boolean;
  onStartAd: () => void;
}

export function AdContent({ 
  completed
}: AdContentProps) {
  if (completed) {
    return (
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check className="w-10 h-10 text-green-600" />
      </div>
    );
  }
  
  return (
    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-fipt-blue/10">
      <Play className="w-10 h-10 text-fipt-blue" />
    </div>
  );
}
