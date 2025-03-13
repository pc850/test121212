
import { useEffect, useRef, useState, forwardRef, ForwardedRef } from "react";

interface VideoPlayerProps {
  containerId: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
}

const VideoPlayer = forwardRef(({ 
  containerId, 
  width = "100%", 
  height = "100%", 
  onLoad 
}: VideoPlayerProps, ref: ForwardedRef<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up any existing content
    containerRef.current.innerHTML = '';
    
    // Create container with the requested ID
    const playerContainer = document.createElement('div');
    playerContainer.id = containerId;
    playerContainer.style.width = typeof width === 'number' ? `${width}px` : width;
    playerContainer.style.height = typeof height === 'number' ? `${height}px` : height;
    containerRef.current.appendChild(playerContainer);
    
    // Remove any existing script
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
    }
    
    // Load the script dynamically
    const script = document.createElement('script');
    script.src = `https://ttedwm.com/embed/lf?c=${containerId}&site=jasmin&cobrandId=&psid=fiptonton&pstool=202_1&psprogram=revs&campaign_id=&category=hot_flirt&forcedPerformers[]=&vp[showChat]=&vp[chatAutoHide]=&vp[showCallToAction]=&vp[showPerformerName]=&vp[showPerformerStatus]=&ms_notrack=1&subAffId={SUBAFFID}`;
    script.async = true;
    
    // Add load event handler
    script.onload = () => {
      // Wait a short amount of time to ensure the player has initialized
      setTimeout(() => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      }, 500);
    };
    
    // Store the script reference
    scriptRef.current = script;
    
    // Append script to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        document.body.removeChild(scriptRef.current);
      }
      setIsLoaded(false);
    };
  }, [containerId, width, height, onLoad]);
  
  return <div ref={(node) => {
    // Handle both the forwarded ref and our internal ref
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
    
    // Also update our internal ref
    containerRef.current = node;
  }} className="video-player-container" />;
});

// Add display name for better debugging
VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
