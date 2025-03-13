
import { useState, useEffect, useRef } from "react";

interface Stream {
  room: string;
  campaign: string;
}

const streams: Stream[] = [
  { room: 'alfredouihuntoui', campaign: '6DE6w' },
  { room: 'another_model_room', campaign: '6DE6w' },
  // Add more models here
];

const TikTokScrollFeed = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const scrollTop = scrollContainerRef.current.scrollTop;
    const viewportHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / viewportHeight);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const scrollDiv = scrollContainerRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollDiv) {
        scrollDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentIndex]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-auto scroll-smooth"
      style={{
        scrollSnapType: 'y mandatory'
      }}
    >
      {streams.map(({ room, campaign }, index) => (
        <div
          key={room}
          className="h-screen relative"
          style={{
            scrollSnapAlign: 'start',
          }}
        >
          <iframe
            src={`https://chaturbate.com/fullvideo/?b=${room}&campaign=${campaign}`}
            className="w-full h-full border-none"
            allowFullScreen
            title={`Live Stream - ${room}`}
          />
        </div>
      ))}
    </div>
  );
};

export default TikTokScrollFeed;
