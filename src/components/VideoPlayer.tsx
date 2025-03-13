
import { useEffect, useRef } from "react";

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
    
    // Load the script dynamically
    const script = document.createElement('script');
    script.src = "https://ttedwm.com/embed/tbplyrrnd/?psid=fiptonton&pstool=421_3&sexualOrientation=straight&forcedPerformers[]=&tags=virgin&primaryColor=8AC437&labelColor=11053B&campaign_id=&site=jasmin&accessKey=dbb57faea5338987e757b66689bad62c&ms_notrack=1&c=" + containerId;
    script.async = true;
    script.onload = () => {
      if (onLoad) onLoad();
    };
    
    // Append script to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [containerId, width, height, onLoad]);
  
  return <div ref={containerRef} className="video-player-container" />;
};

export default VideoPlayer;
