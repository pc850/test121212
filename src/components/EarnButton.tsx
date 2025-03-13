
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdDialog } from "@/components/AdDialog";

interface EarnButtonProps {
  onEarn?: (points: number) => void;
}

const EarnButton = ({ onEarn }: EarnButtonProps) => {
  const [points, setPoints] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);
  const [showAdDialog, setShowAdDialog] = useState(false);

  const handleClick = () => {
    // Earn points
    const earnedPoints = 1;
    setPoints(prev => prev + earnedPoints);
    
    // Call the parent's onEarn callback if provided
    if (onEarn) {
      onEarn(earnedPoints);
    }
    
    setIsPressed(true);
    setShowAnimation(true);
    
    // Generate particles
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + Math.random() * 30 - 15,
      y: 50 + Math.random() * 30 - 15,
      size: 8 + Math.random() * 15,
      color: ['#33C3F0', '#F6F6F7', '#0FA0CE'][Math.floor(Math.random() * 3)]
    }));
    
    setParticles([...particles, ...newParticles]);
    
    // Reset button state
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
    
    // Remove animation
    setTimeout(() => {
      setShowAnimation(false);
    }, 700);
    
    // Check if we've hit a multiple of 10 points
    if ((points + 1) % 10 === 0) {
      setShowAdDialog(true);
    }
  };
  
  // Clean up particles
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
      {/* Particles */}
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

      {/* Pulse ring */}
      <div className={cn(
        "absolute w-56 h-56 rounded-full",
        showAnimation ? "animate-pulse-scale ring-2 ring-fipt-blue" : "opacity-0"
      )} />
      
      {/* Main button */}
      <button
        onClick={handleClick}
        className={cn(
          "relative w-48 h-48 bg-gradient-to-br from-fipt-blue to-fipt-accent rounded-full flex items-center justify-center shadow-lg transition-all duration-200",
          isPressed ? "scale-95 shadow-md" : "scale-100 hover:scale-[1.02]"
        )}
      >
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-fipt-blue" />
            <span className="text-2xl font-bold text-fipt-dark">{points}</span>
            <span className="text-sm font-medium text-fipt-muted">FIPT Points</span>
          </div>
        </div>
      </button>
      
      {/* Ad Dialog */}
      <AdDialog 
        open={showAdDialog} 
        onOpenChange={setShowAdDialog} 
        points={10}
      />
    </div>
  );
};

export default EarnButton;
