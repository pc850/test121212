
import { useEffect, useRef, useState, forwardRef, ForwardedRef } from "react";

interface VideoPlayerProps {
  containerId: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  performerId?: string;
}

const VideoPlayer = forwardRef(({ 
  containerId, 
  width = "100%", 
  height = "100%", 
  onLoad,
  performerId
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
    
    // Add the video overlay element
    const videoOverlay = document.createElement('div');
    videoOverlay.className = 'mc_video_overlay mc_js_video_overlay';
    videoOverlay.setAttribute('data-testid', 'videoOverlay');
    containerRef.current.appendChild(videoOverlay);
    
    // Remove any existing script
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
    }
    
    // Load the script dynamically with the performer parameter if provided
    const script = document.createElement('script');
    
    // If a specific performer ID is provided, use it in the URL
    if (performerId) {
      script.src = `https://wmedps.com/pu/?target=wmrttr&site=jasmin&psid=fiptonton&psprogram=revs&campaign_id=&category=girl&ms_notrack=1&subaffid={SUBAFFID}&performer=${performerId}`;
    } else {
      script.src = `https://wmedps.com/pu/?target=wmrttr&site=jasmin&psid=fiptonton&psprogram=revs&campaign_id=&category=girl&ms_notrack=1&subaffid={SUBAFFID}`;
    }
    
    script.async = true;
    
    // Add load event handler
    script.onload = () => {
      // Wait a short amount of time to ensure the player has initialized
      setTimeout(() => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      }, 1000); // Increased timeout to give more time for initialization
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
  }, [containerId, width, height, onLoad, performerId]);
  
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
