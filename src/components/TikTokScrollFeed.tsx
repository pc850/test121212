
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Stream } from "@/types/streams";
import StreamItem from "@/components/streams/StreamItem";
import LoadingIndicator from "@/components/streams/LoadingIndicator";
import ErrorMessage from "@/components/streams/ErrorMessage";
import InfiniteScrollHandler from "@/components/streams/InfiniteScrollHandler";
import { fetchChaturbateRooms, initialStreams } from "@/services/StreamsService";

const TikTokScrollFeed = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streams, setStreams] = useState<Stream[]>(initialStreams);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Function to fetch streams
  const fetchStreams = async (pageNumber: number, showToast = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchChaturbateRooms(pageNumber);
      
      if (result.error) {
        setError(result.error);
        if (showToast) {
          toast({
            title: "Error loading streams",
            description: result.error,
            variant: "destructive"
          });
        }
      }
      
      // Always show initialStreams first (YouTube videos), then append new streams
      if (pageNumber === 1) {
        setStreams(initialStreams); // We always show initialStreams first
      } else {
        const newStreams = result.streams.filter(
          // Filter out any duplicate IDs
          newStream => !streams.some(existingStream => existingStream.id === newStream.id)
        );
        setStreams(prevStreams => [...prevStreams, ...newStreams]);
      }
      
      // If no new streams returned or error occurred, we've reached the end
      if (result.streams.length === 0 || result.error) {
        setHasMore(false);
      } else {
        setPage(pageNumber);
      }
    } catch (err) {
      console.error("Unexpected error during fetch:", err);
      setError("An unexpected error occurred");
      if (showToast) {
        toast({
          title: "Error loading streams",
          description: "An unexpected error occurred while loading streams",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchStreams(1);
  }, []);
  
  // Function to load more streams as user scrolls
  const loadMoreStreams = () => {
    if (isLoading || !hasMore) return;
    fetchStreams(page + 1);
  };
  
  // Retry fetch function for error state
  const handleRetry = () => {
    setPage(1);
    fetchStreams(1, true);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const scrollTop = scrollContainerRef.current.scrollTop;
    const viewportHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / viewportHeight);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      console.log(`Current stream index: ${newIndex}`);
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

  // Show full-screen error only if no streams loaded and error exists
  if (error && streams.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-auto scroll-smooth scrollbar-hide"
      style={{
        scrollSnapType: 'y mandatory'
      }}
    >
      {/* Error banner if we have some streams but encountered an error loading more */}
      {error && streams.length > 0 && (
        <div className="sticky top-0 z-10 p-2 bg-destructive/90 text-destructive-foreground text-center text-sm">
          Error loading more streams. <button className="underline" onClick={handleRetry}>Try again</button>
        </div>
      )}
      
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
      
      {!hasMore && streams.length > 0 && !error && (
        <div className="py-8 text-center text-muted-foreground">
          No more streams to load
        </div>
      )}
    </div>
  );
};

export default TikTokScrollFeed;
