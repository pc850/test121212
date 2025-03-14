
import { Stream } from "@/types/streams";

// Function to generate streams for the feed
export const generateFallbackStreams = (count: number, startId: number): Stream[] => {
  return Array.from({ length: count }, (_, i) => ({
    room: `Content Item ${startId + i}`,
    campaign: '',
    id: `fallback-${startId + i}`,
    image: `https://images.unsplash.com/photo-164997290434${i}-6e44c42644a7?w=300&h=200&fit=crop`
  }));
};

// Initial stream data - removed duplicates and integrated new YouTube shorts
export const initialStreams: Stream[] = [
  { room: 'Travel Adventures', campaign: 'Sponsored Content', id: 'youtube-HNXdKlrXli8', image: 'https://img.youtube.com/vi/HNXdKlrXli8/hqdefault.jpg', youtubeId: 'HNXdKlrXli8' },
  { room: 'Tech Review', campaign: 'Tech Channel', id: 'youtube-fZqw72eyul8', image: 'https://img.youtube.com/vi/fZqw72eyul8/hqdefault.jpg', youtubeId: 'fZqw72eyul8' },
  { room: 'Fashion Trends', campaign: 'Style Shorts', id: 'youtube-de8k7B4cH-c', image: 'https://img.youtube.com/vi/de8k7B4cH-c/hqdefault.jpg', youtubeId: 'de8k7B4cH-c' },
  { room: 'Dancing Tutorial', campaign: 'Dance Shorts', id: 'youtube-wrF05hhjiiE', image: 'https://img.youtube.com/vi/wrF05hhjiiE/hqdefault.jpg', youtubeId: 'wrF05hhjiiE' },
  { room: 'DIY Crafts', campaign: 'Creative Shorts', id: 'youtube-JCO8fLhZEP4', image: 'https://img.youtube.com/vi/JCO8fLhZEP4/hqdefault.jpg', youtubeId: 'JCO8fLhZEP4' },
  { room: 'Cooking Tips', campaign: 'Food Shorts', id: 'youtube-htKEAY7_fag', image: 'https://img.youtube.com/vi/htKEAY7_fag/hqdefault.jpg', youtubeId: 'htKEAY7_fag' },
  { room: 'Trending Short', campaign: 'New Content', id: 'youtube-0huzABsMTS8', image: 'https://img.youtube.com/vi/0huzABsMTS8/hqdefault.jpg', youtubeId: '0huzABsMTS8' },
  { room: 'Funny Moment', campaign: 'Entertainment', id: 'youtube-KdDp-aFDRkc', image: 'https://img.youtube.com/vi/KdDp-aFDRkc/hqdefault.jpg', youtubeId: 'KdDp-aFDRkc' },
  { room: 'Music Video', campaign: 'Entertainment', id: 'youtube-9bZkp7q19f0', image: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg', youtubeId: '9bZkp7q19f0' },
];

// Get 5 content items per page based on the page number
export const fetchChaturbateRooms = async (pageNum: number): Promise<{ streams: Stream[], error: string | null }> => {
  try {
    // Get 5 content items per page based on the page number
    const startIndex = (pageNum - 1) * 5;
    const endIndex = Math.min(startIndex + 5, 20); // Limiting to 20 items total
    
    if (startIndex >= 20) {
      // No more content items to show
      return { streams: [], error: null };
    }
    
    // Map the items to our Stream format
    const streams = Array.from({ length: endIndex - startIndex }, (_, i) => ({
      room: `Content Item ${startIndex + i + 1}`,
      campaign: '',
      id: `page-${pageNum}-${i}`,
      image: `https://source.unsplash.com/random/300x200?sig=${startIndex + i}`
    }));
    
    return { streams, error: null };
  } catch (error) {
    console.error('Error creating streams:', error);
    
    // Return fallback data if there's an error
    return {
      streams: generateFallbackStreams(5, (pageNum - 1) * 5 + 1),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
