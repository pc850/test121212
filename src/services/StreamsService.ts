
import { Stream, ChaturbateRoom } from "@/types/streams";
import { toast } from "@/hooks/use-toast";

const affiliateCode = '6DE6w'; // Your affiliate code

// Function to generate fallback streams if API fails
export const generateFallbackStreams = (count: number, startId: number): Stream[] => {
  return Array.from({ length: count }, (_, i) => ({
    room: `model_room_${startId + i}`,
    campaign: '6DE6w',
    id: `${startId + i}`,
    image: `https://images.unsplash.com/photo-164997290434${i}-6e44c42644a7?w=300&h=200&fit=crop`
  }));
};

// Initial stream data (fallback)
export const initialStreams: Stream[] = [
  { room: 'alfredouihuntoui', campaign: '6DE6w', id: '1', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop' },
  { room: 'another_model_room', campaign: '6DE6w', id: '2', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop' },
];

export const fetchChaturbateRooms = async (pageNum: number): Promise<{ streams: Stream[], error: string | null }> => {
  try {
    // Updated to use the new affiliate ID
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=alfredouihuntoui&page=${pageNum}`
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
        id: `chaturbate-${pageNum}-${index}`,
        image: room.image_url || `https://images.unsplash.com/photo-${1486312338219 + index}-ce68d2c6f44d?w=300&h=200&fit=crop`
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
