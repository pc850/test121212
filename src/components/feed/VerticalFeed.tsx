
import { useRef, useState, useEffect } from "react";
import FeedCard from "@/components/FeedCard";

interface FeedItem {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  video?: boolean;
  performerId?: string;
  youtubeVideoId?: string;
  likes: number;
  comments: number;
  shares: number;
}

interface VerticalFeedProps {
  feedData: FeedItem[];
  balance: number;
  onBalanceChange: (amount: number) => void;
  isLoading: boolean;
}

const VerticalFeed = ({ 
  feedData, 
  balance, 
  onBalanceChange, 
  isLoading 
}: VerticalFeedProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize refs array
    feedRefs.current = feedRefs.current.slice(0, feedData.length);

    // Set up intersection observer for snap scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = feedRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.7 } // Trigger when 70% of element is visible
    );

    feedRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      feedRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [feedData.length]);

  return (
    <div className="h-screen pt-24 pb-16 snap-y snap-mandatory overflow-y-auto no-scrollbar">
      {feedData.map((post, index) => (
        <div 
          key={post.id}
          ref={el => feedRefs.current[index] = el}
          className="h-[calc(100vh-120px)] w-full snap-start snap-always flex items-center justify-center"
        >
          <FeedCard 
            {...post}
            isActive={activeIndex === index}
            balance={balance}
            onBalanceChange={onBalanceChange}
          />
        </div>
      ))}
      
      {/* Loader */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-fipt-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default VerticalFeed;
