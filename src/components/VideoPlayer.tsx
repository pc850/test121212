
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  containerId: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
}

const VideoPlayer = ({ 
  containerId, 
  width = "100%", 
  height = "100%", 
  onLoad 
}: VideoPlayerProps) => {
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
    playerContainer.setAttribute('data-awe-container-id', containerId);
    playerContainer.style.width = typeof width === 'number' ? `${width}px` : width;
    playerContainer.style.height = typeof height === 'number' ? `${height}px` : height;
    containerRef.current.appendChild(playerContainer);
    
    // Remove any existing script
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
    }
    
    // Load the script dynamically
    const script = document.createElement('script');
    script.src = "https://ttedwm.com/embed/tbplyrrnd/?psid=fiptonton&pstool=421_3&sexualOrientation=straight&forcedPerformers[]=&tags=virgin&primaryColor=8AC437&labelColor=11053B&campaign_id=&site=jasmin&accessKey=dbb57faea5338987e757b66689bad62c&ms_notrack=1&c=" + containerId;
    script.async = true;
    
    // Add load event handler
    script.onload = () => {
      setIsLoaded(true);
      if (onLoad) onLoad();
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
  
  return <div ref={containerRef} className="video-player-container" />;
};

export default VideoPlayer;
