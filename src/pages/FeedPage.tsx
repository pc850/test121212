
import { useEffect, useState, useRef } from "react";
import FeedCard from "@/components/FeedCard";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const mockFeedData = [
  {
    id: "1",
    username: "alex_crypto",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    content: "Just earned 500 FIPT tokens today! The click-to-earn mechanism is so addictive 🚀",
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=500&auto=format&fit=crop",
    likes: 128,
    comments: 24,
    shares: 7
  },
  {
    id: "2",
    username: "crypto_whale",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    content: "FIPT community is growing fast! Who else is excited about the upcoming features?",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=500&auto=format&fit=crop",
    likes: 87,
    comments: 14,
    shares: 3
  },
  {
    id: "3",
    username: "blockchain_dev",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    content: "Check out my new achievement in FIPT! Reached top 10 on the leaderboard.",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=500&auto=format&fit=crop",
    likes: 256,
    comments: 42,
    shares: 18
  },
  {
    id: "4",
    username: "defi_guru",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    content: "Pro tip: Make sure to check in daily for bonus points. I've accumulated over 10,000 FIPT this month!",
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=600&auto=format&fit=crop",
    likes: 198,
    comments: 35,
    shares: 11
  }
];

const FeedPage = () => {
  const [feedData, setFeedData] = useState(mockFeedData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Set page title
    document.title = "FIPT - Feed";
    
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
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 py-3 px-4 flex items-center justify-between glass">
        <h1 className="text-xl font-bold text-fipt-dark">FIPT Feed</h1>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-2 w-32 rounded-full text-sm text-fipt-dark bg-fipt-gray border-none focus:outline-none focus:ring-2 focus:ring-fipt-blue"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fipt-muted" />
        </div>
      </div>
      
      {/* Feed - TikTok Style Vertical Scroll */}
      <div className="h-screen pt-14 pb-16 snap-y snap-mandatory overflow-y-auto no-scrollbar">
        {feedData.map((post, index) => (
          <div 
            key={post.id}
            ref={el => feedRefs.current[index] = el}
            className="h-[calc(100vh-120px)] w-full snap-start snap-always flex items-center justify-center"
          >
            <FeedCard 
              {...post}
              isActive={activeIndex === index}
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
    </div>
  );
};

export default FeedPage;
