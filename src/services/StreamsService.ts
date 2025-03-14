
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

// Initial stream data
export const initialStreams: Stream[] = [
  { room: 'Content Item 1', campaign: '', id: 'initial-1', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop' },
  { room: 'Content Item 2', campaign: '', id: 'initial-2', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop' },
];

// Generate a list of content items
const contentItems = Array.from({ length: 20 }, (_, i) => `Content Item ${i + 1}`);

export const fetchChaturbateRooms = async (pageNum: number): Promise<{ streams: Stream[], error: string | null }> => {
  try {
    // Get 5 content items per page based on the page number
    const startIndex = (pageNum - 1) * 5;
    const endIndex = Math.min(startIndex + 5, contentItems.length);
    
    if (startIndex >= contentItems.length) {
      // No more content items to show
      return { streams: [], error: null };
    }
    
    const pageItems = contentItems.slice(startIndex, endIndex);
    
    // Map the items to our Stream format
    const streams = pageItems.map((item, index) => ({
      room: item,
      campaign: '',
      id: `page-${pageNum}-${index}`,
      image: `https://source.unsplash.com/random/300x200?sig=${startIndex + index}`
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
