
import { useRef, useEffect } from "react";

interface AdVideoPlayerProps {
  adPlaying: boolean;
  adLoaded: boolean;
  setAdLoaded: (loaded: boolean) => void;
}

export function AdVideoPlayer({ adPlaying, adLoaded, setAdLoaded }: AdVideoPlayerProps) {
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (adPlaying) {
      // Simulate video loading delay
      setTimeout(() => {
        setAdLoaded(true);
      }, 1000);
    }
  }, [adPlaying, setAdLoaded]);

  if (!adPlaying) return null;

  return (
    <div className="w-full max-w-md h-96 mb-4 relative bg-black">
      {!adLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <iframe 
        ref={videoRef}
        src="https://www.tiktok.com/embed/v2/7338609783458565382"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="TikTok Video"
      ></iframe>
    </div>
  );
}
