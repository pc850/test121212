
import { useEffect, useState, useRef } from "react";
import FeedCard from "@/components/FeedCard";
import TikTokScrollFeed from "@/components/TikTokScrollFeed";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import TonConnectButton from "@/components/TonConnectButton";

const mockFeedData = [
  {
    id: "youtube-1",
    username: "official_music",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    content: "Check out this amazing music video! 🎵",
    youtubeVideoId: "Ot35fFp44xo",
    video: false,
    likes: 342,
    comments: 57,
    shares: 28
  },
  {
    id: "youtube-shorts-1",
    username: "shorts_creator",
    userAvatar: "https://i.pravatar.cc/150?img=6",
    content: "Watch this cool YouTube Short! 📱",
    youtubeVideoId: "nBIQJ7WOjYE",
    video: false,
    likes: 578,
    comments: 122,
    shares: 89
  },
  {
    id: "youtube-shorts-2",
    username: "crypto_shorts",
    userAvatar: "https://i.pravatar.cc/150?img=7",
    content: "Another awesome crypto short! 🚀",
    youtubeVideoId: "YqUURXG6u4U",
    video: false,
    likes: 423,
    comments: 89,
    shares: 64
  },
  {
    id: "youtube-shorts-3",
    username: "tech_shorts",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    content: "Amazing tech demo short! 💻",
    youtubeVideoId: "5JJoZG6ih5Y",
    video: false,
    likes: 315,
    comments: 42,
    shares: 18
  },
  {
    id: "youtube-shorts-4",
    username: "tech_tips",
    userAvatar: "https://i.pravatar.cc/150?img=9",
    content: "Check out this tech tutorial! 🔥",
    youtubeVideoId: "5JJoZG6ih5Y",
    video: false,
    likes: 492,
    comments: 76,
    shares: 31
  },
  {
    id: "youtube-shorts-5",
    username: "gaming_shorts",
    userAvatar: "https://i.pravatar.cc/150?img=10",
    content: "Check out this awesome gaming moment! 🎮",
    youtubeVideoId: "diVyjXePZ08",
    video: false,
    likes: 367,
    comments: 54,
    shares: 22
  },
  {
    id: "youtube-shorts-6",
    username: "travel_shorts",
    userAvatar: "https://i.pravatar.cc/150?img=11",
    content: "Beautiful travel destinations you must see! ✈️",
    youtubeVideoId: "dbr8c4SmatA",
    video: false,
    likes: 412,
    comments: 63,
    shares: 35
  },
  {
    id: "1",
    username: "alex_crypto",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    content: "Just earned 500 FIPT tokens today! The click-to-earn mechanism is so addictive 🚀",
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=500&auto=format&fit=crop",
    video: false,
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
    video: false,
    likes: 87,
    comments: 14,
    shares: 3
  },
  {
    id: "3",
    username: "MoniqueSpell",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    content: "Live now! Join my room and let's chat 💕",
    image: null,
    video: true,
    performerId: "MoniqueSpell",
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
    video: false,
    likes: 198,
    comments: 35,
    shares: 11
  }
];

const FeedPage = () => {
  const [feedData, setFeedData] = useState(mockFeedData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showWebcams, setShowWebcams] = useState(false);
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();
  
  // Get the user's balance from localStorage
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('fiptBalance');
    return savedBalance ? parseInt(savedBalance, 10) : 0;
  });

  // Update balance in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fiptBalance', balance.toString());
  }, [balance]);

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

  // Function to update the balance (for FeedCard interactions)
  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const toggleFeedType = () => {
    setShowWebcams(prev => !prev);
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 py-3 px-4 flex items-center justify-between glass">
        <h1 className="text-xl font-bold text-fipt-dark">FIPT Feed</h1>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-fipt-blue/10 text-sm font-medium text-fipt-blue">
            {balance} FIPT
          </span>
          <TonConnectButton />
          <div className="relative">
            <input 
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 w-32 rounded-full text-sm text-fipt-dark bg-fipt-gray border-none focus:outline-none focus:ring-2 focus:ring-fipt-blue"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fipt-muted" />
          </div>
        </div>
      </div>
      
      <div className="absolute top-16 left-0 right-0 z-10 py-2 px-4 flex justify-center gap-2 glass">
        <Button 
          variant={!showWebcams ? "default" : "outline"}
          size="sm"
          onClick={() => setShowWebcams(false)}
          className="rounded-full"
        >
          FIPT Feed
        </Button>
        <Button 
          variant={showWebcams ? "default" : "outline"}
          size="sm"
          onClick={() => setShowWebcams(true)}
          className="rounded-full"
        >
          Live Streams
        </Button>
      </div>
      
      {showWebcams ? (
        <TikTokScrollFeed />
      ) : (
        /* Feed - TikTok Style Vertical Scroll */
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
                onBalanceChange={updateBalance}
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
      )}
    </div>
  );
};

export default FeedPage;
