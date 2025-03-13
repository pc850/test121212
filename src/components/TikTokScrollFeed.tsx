
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Stream } from "@/types/streams";
import StreamItem from "@/components/streams/StreamItem";
import LoadingIndicator from "@/components/streams/LoadingIndicator";
import InfiniteScrollHandler from "@/components/streams/InfiniteScrollHandler";
import { fetchChaturbateRooms, initialStreams } from "@/services/StreamsService";

const TikTokScrollFeed = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streams, setStreams] = useState<Stream[]>(initialStreams);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  
  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const initialRooms = await fetchChaturbateRooms(1);
        setStreams(initialRooms);
      } catch (error) {
        console.error("Failed to fetch initial streams:", error);
      } finally {
        setIsLoading(false);
      }
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
      // After 20 fallback streams, stop showing more
      if (streams.length >= 20) {
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
      <InfiniteScrollHandler
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMoreStreams}
      >
        {(lastElementRef) => (
          <>
            {streams.map((stream, index) => (
              <StreamItem
                key={stream.id}
                stream={stream}
                isLastElement={index === streams.length - 1}
                lastElementRef={lastElementRef}
              />
            ))}
          </>
        )}
      </InfiniteScrollHandler>
      
      {isLoading && <LoadingIndicator />}
      
      {!hasMore && streams.length > 0 && (
        <div className="py-8 text-center text-fipt-muted">
          No more streams to load
        </div>
      )}
    </div>
  );
};

export default TikTokScrollFeed;
