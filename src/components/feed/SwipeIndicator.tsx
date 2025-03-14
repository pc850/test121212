
import { ChevronUp, ChevronDown } from "lucide-react";

const SwipeIndicator = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center gap-1">
      <ChevronUp className="w-5 h-5 text-white/70" />
      <span className="text-xs text-white/70">Swipe</span>
      <ChevronDown className="w-5 h-5 text-white/70" />
    </div>
  );
};

export default SwipeIndicator;
