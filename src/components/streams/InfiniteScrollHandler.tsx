
import React, { useRef, useCallback } from "react";

interface InfiniteScrollHandlerProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: (ref: (node: HTMLDivElement | null) => void) => React.ReactNode;
}

const InfiniteScrollHandler: React.FC<InfiniteScrollHandlerProps> = ({
  isLoading,
  hasMore,
  onLoadMore,
  children
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, onLoadMore]);

  return <>{children(lastElementRef)}</>;
};

export default InfiniteScrollHandler;
