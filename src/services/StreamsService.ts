
import { Stream, ChaturbateRoom } from "@/types/streams";
import { toast } from "@/hooks/use-toast";

const affiliateCode = '6DE6w'; // Your affiliate code

// Function to generate fallback streams if API fails
export const generateFallbackStreams = (count: number, startId: number): Stream[] => {
  return Array.from({ length: count }, (_, i) => ({
    room: `model_room_${startId + i}`,
    campaign: '6DE6w',
    id: `${startId + i}`
  }));
};

// Initial stream data (fallback)
export const initialStreams: Stream[] = [
  { room: 'alfredouihuntoui', campaign: '6DE6w', id: '1' },
  { room: 'another_model_room', campaign: '6DE6w', id: '2' },
];

export const fetchChaturbateRooms = async (pageNum: number): Promise<{ streams: Stream[], error: string | null }> => {
  try {
    // For demonstration purposes, we're using a proxy URL. In production, this should be a backend endpoint
    // that makes the API call with proper authentication.
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=fiptonton&page=${pageNum}`
    )}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    
    const data = await response.json();
    let rooms: ChaturbateRoom[] = [];
    
    // Parse the response content
    if (data && data.contents) {
      try {
        const parsedContent = JSON.parse(data.contents);
        
        // Check if API returned errors
        if (parsedContent.errors) {
          console.error('API returned errors:', parsedContent.errors);
          throw new Error('API returned an error response');
        }
        
        rooms = parsedContent.results || [];
      } catch (e) {
        console.error('Error parsing API response:', e);
        throw new Error('Invalid API response format');
      }
    }
    
    // Map the API response to our Stream format
    return {
      streams: rooms.map((room, index) => ({
        room: room.username,
        campaign: affiliateCode,
        id: `chaturbate-${pageNum}-${index}`
      })),
      error: null
    };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    
    // Return fallback data if API fails along with the error message
    return {
      streams: generateFallbackStreams(5, (pageNum - 1) * 5 + 1),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
