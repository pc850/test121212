
import { useState, useEffect, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Stream {
  room: string;
  campaign: string;
  id: string;
}

interface ChaturbateRoom {
  username: string;
  current_show: string;
  num_users: number;
  num_followers: number;
  display_name: string;
  gender: string;
  tags: string[];
  image_url: string;
  is_hd: boolean;
}

// Initial stream data (fallback)
const initialStreams: Stream[] = [
  { room: 'alfredouihuntoui', campaign: '6DE6w', id: '1' },
  { room: 'another_model_room', campaign: '6DE6w', id: '2' },
];

// Function to generate fallback streams if API fails
const generateFallbackStreams = (count: number, startId: number): Stream[] => {
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
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const affiliateCode = '6DE6w'; // Your affiliate code
  
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
  
  // Function to fetch streams from Chaturbate API
  const fetchChaturbateRooms = async (pageNum: number): Promise<Stream[]> => {
    try {
      // For demonstration purposes, we're using a proxy URL. In production, this should be a backend endpoint
      // that makes the API call with proper authentication.
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=fiptonton&page=${pageNum}`
      )}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      
      const data = await response.json();
      let rooms: ChaturbateRoom[] = [];
      
      // Parse the response content
      if (data && data.contents) {
        try {
          const parsedContent = JSON.parse(data.contents);
          rooms = parsedContent.results || [];
        } catch (e) {
          console.error('Error parsing API response:', e);
          throw new Error('Invalid API response format');
        }
      }
      
      // Map the API response to our Stream format
      return rooms.map((room, index) => ({
        room: room.username,
        campaign: affiliateCode,
        id: `chaturbate-${pageNum}-${index}`
      }));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error loading streams",
        description: "Using fallback data instead",
        variant: "destructive"
      });
      
      // Return fallback data if API fails
      return generateFallbackStreams(5, (pageNum - 1) * 5 + 1);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const initialRooms = await fetchChaturbateRooms(1);
      setStreams(initialRooms);
      setIsLoading(false);
    };
    
    fetchInitialData();
  }, []);
  
  // Function to load more streams as user scrolls
  const loadMoreStreams = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      // Fetch the next page of rooms
      const nextPage = page + 1;
      const newRooms = await fetchChaturbateRooms(nextPage);
      
      // If no new rooms returned, we've reached the end
      if (newRooms.length === 0) {
        setHasMore(false);
      } else {
        setStreams(prevStreams => [...prevStreams, ...newRooms]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more streams:', error);
      // Even if there's an error, let's add some fallback data
      const fallbackStreams = generateFallbackStreams(3, streams.length + 1);
      setStreams(prevStreams => [...prevStreams, ...fallbackStreams]);
      
      // After 20 fallback streams, stop showing more
      if (streams.length + 3 >= 20) {
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
    }
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
              src={`https://chaturbate.com/in/?tour=Limj&campaign=${stream.campaign}&track=default&signup_notice=1&b=${stream.room}`}
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
