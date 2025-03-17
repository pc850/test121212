
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdDialog } from "@/components/ad/AdDialog";
import { useToast } from "@/hooks/use-toast";

interface EarnButtonProps {
  onEarn?: (points: number) => void;
  disabled?: boolean;
}

const EarnButton = ({ onEarn, disabled = false }: EarnButtonProps) => {
  const [points, setPoints] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [pendingPoints, setPendingPoints] = useState(0);
  const { toast } = useToast();

  const handleClick = () => {
    if (disabled) return;
    
    const earnedPoints = 1;
    setPoints(prev => prev + earnedPoints);
    
    if (onEarn) {
      onEarn(earnedPoints);
    }
    
    setIsPressed(true);
    setShowAnimation(true);
    
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + Math.random() * 30 - 15,
      y: 50 + Math.random() * 30 - 15,
      size: 8 + Math.random() * 15,
      color: ['#33C3F0', '#F6F6F7', '#0FA0CE'][Math.floor(Math.random() * 3)]
    }));
    
    setParticles([...particles, ...newParticles]);
    
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
    
    setTimeout(() => {
      setShowAnimation(false);
    }, 700);
    
    if ((points + 1) % 10 === 0) {
      console.log("Showing ad dialog after 10 clicks");
      setPendingPoints(10);
      setShowAdDialog(true);
    }
  };
  
  const handleAdSuccess = (claimedPoints: number) => {
    // This function is called when an ad is successfully viewed and claimed
    console.log('Ad completed successfully, claiming points:', claimedPoints);
    
    if (onEarn) {
      // Call the onEarn handler with the claimed points
      onEarn(claimedPoints);
      
      // Show a success toast
      toast({
        title: "Points Claimed!",
        description: `You've earned ${claimedPoints} FIPT points.`,
        variant: "default"
      });
    }
    
    // Reset pending points
    setPendingPoints(0);
  };
  
  const handleAdSkip = () => {
    console.log('Ad skipped, no points awarded');
    setPendingPoints(0);
    
    toast({
      title: "Ad Skipped",
      description: "No points were awarded.",
      variant: "default"
    });
  };
  
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fade-in opacity-0"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            animation: 'fade-in 0.3s ease-out forwards, slide-up 1s ease-out forwards',
          }}
        />
      ))}
      
      <div className={cn(
        "absolute w-56 h-56 rounded-full",
        showAnimation ? "animate-pulse-scale ring-2 ring-fipt-blue" : "opacity-0"
      )} />
      
      {/* Make the entire button area clickable */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative w-48 h-48 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer",
          disabled 
            ? "bg-gray-200 cursor-not-allowed" 
            : "bg-gradient-to-br from-fipt-blue to-fipt-accent hover:scale-[1.02] active:scale-95",
          isPressed && !disabled ? "scale-95 shadow-md" : "scale-100"
        )}
        aria-label="Earn FIPT points"
      >
        <div className={cn(
          "absolute inset-2 rounded-full flex items-center justify-center",
          disabled ? "bg-gray-100" : "bg-white pointer-events-none"
        )}>
          <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
            <Sparkles className={cn(
              "w-10 h-10", 
              disabled ? "text-gray-400" : "text-fipt-blue"
            )} />
            <span className={cn(
              "text-2xl font-bold", 
              disabled ? "text-gray-400" : "text-fipt-dark"
            )}>
              {points}
            </span>
            <span className={cn(
              "text-sm font-medium", 
              disabled ? "text-gray-400" : "text-fipt-muted"
            )}>
              FIPT Points
            </span>
          </div>
        </div>
      </button>
      
      <AdDialog 
        open={showAdDialog} 
        onOpenChange={setShowAdDialog} 
        points={pendingPoints}
        onSuccess={handleAdSuccess}
        onSkip={handleAdSkip}
      />
    </div>
  );
};

export default EarnButton;
