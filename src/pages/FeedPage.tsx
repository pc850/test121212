
import { useEffect, useState } from "react";
import FeedCard from "@/components/FeedCard";
import { Search } from "lucide-react";

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
    likes: 198,
    comments: 35,
    shares: 11
  }
];

const FeedPage = () => {
  const [feedData, setFeedData] = useState(mockFeedData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "FIPT - Feed";
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
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
      
      {/* Feed */}
      <div className="flex-1">
        {feedData.map(post => (
          <FeedCard 
            key={post.id}
            {...post}
          />
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
