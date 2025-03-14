
import { Stream } from "@/types/streams";
import { toast } from "@/hooks/use-toast";

// Function to generate streams for the feed
export const generateFallbackStreams = (count: number, startId: number): Stream[] => {
  return Array.from({ length: count }, (_, i) => ({
    room: `ad_slot_${startId + i}`,
    campaign: '',
    id: `${startId + i}`,
    image: `https://images.unsplash.com/photo-164997290434${i}-6e44c42644a7?w=300&h=200&fit=crop`
  }));
};

// Initial stream data
export const initialStreams: Stream[] = [
  { room: 'ad_slot_1', campaign: '', id: '1', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop' },
  { room: 'ad_slot_2', campaign: '', id: '2', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop' },
];

// Generate a list of ad slots
const adSlots = Array.from({ length: 20 }, (_, i) => `ad_slot_${i + 1}`);

export const fetchChaturbateRooms = async (pageNum: number): Promise<{ streams: Stream[], error: string | null }> => {
  try {
    // Get 5 ad slots per page based on the page number
    const startIndex = (pageNum - 1) * 5;
    const endIndex = Math.min(startIndex + 5, adSlots.length);
    
    if (startIndex >= adSlots.length) {
      // No more ad slots to show
      return { streams: [], error: null };
    }
    
    const pageSlots = adSlots.slice(startIndex, endIndex);
    
    // Map the slots to our Stream format
    const streams = pageSlots.map((slot, index) => {
      return {
        room: slot,
        campaign: '',
        id: `ad-${pageNum}-${index}`,
        image: `https://source.unsplash.com/random/300x200?sig=${startIndex + index}`
      };
    });
    
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
