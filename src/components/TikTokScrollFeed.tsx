
import { useState, useEffect, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stream {
  room: string;
  campaign: string;
  id: string;
}

// Initial stream data
const initialStreams: Stream[] = [
  { room: 'alfredouihuntoui', campaign: '6DE6w', id: '1' },
  { room: 'another_model_room', campaign: '6DE6w', id: '2' },
  // Add more models here
];

// Function to generate more stream data (in a real app, this would be an API call)
const generateMoreStreams = (count: number, startId: number): Stream[] => {
  return Array.from({ length: count }, (_, i) => ({
    room: `model_room_${startId + i}`,
    campaign: '6DE6w',
    id: `${startId + i}`
  }));
};

const TikTokScrollFeed = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streams, setStreams] = useState<Stream[]>(initialStreams);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Observer for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastStreamElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreStreams();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);
  
  // Function to load more streams - load more streams as user scrolls
  const loadMoreStreams = () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate more streams - in a real app, you would fetch from an API
      const newStreams = generateMoreStreams(3, streams.length + 1); // Increased from 2 to 3 for better fill rate
      
      // In a real application, you might want to check if the server has more data
      // For now, we'll limit to 20 streams total for demonstration (increased from 10)
      if (streams.length + newStreams.length >= 20) {
        setHasMore(false);
      }
      
      setStreams(prevStreams => [...prevStreams, ...newStreams]);
      setIsLoading(false);
    }, 1000); // Reduced from 1500ms to 1000ms for faster loading
  };

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
      {streams.map((stream, index) => {
        const isLastElement = index === streams.length - 1;
        
        return (
          <div
            key={stream.id}
            ref={isLastElement ? lastStreamElementRef : null}
            className="h-screen relative"
            style={{
              scrollSnapAlign: 'start',
            }}
          >
            <iframe
              src={`https://chaturbate.com/embed/${stream.room}/?campaign=${stream.campaign}&disable_sound=0&tour=limt&mobileRedirect=never`}
              className="w-full h-full border-none"
              allowFullScreen
              title={`Live Stream - ${stream.room}`}
            />
          </div>
        );
      })}
      
      {isLoading && (
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="w-12 h-12 border-4 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {!hasMore && streams.length > 0 && (
        <div className="py-8 text-center text-fipt-muted">
          No more streams to load
        </div>
      )}
    </div>
  );
};

export default TikTokScrollFeed;
