
import { Stream, ChaturbateRoom } from "@/types/streams";
import { toast } from "@/hooks/use-toast";

const affiliateCode = '6DE6w'; // Your affiliate code

// Function to generate fallback streams if API fails
export const generateFallbackStreams = (count: number, startId: number): Stream[] => {
  return Array.from({ length: count }, (_, i) => ({
    room: `model_room_${startId + i}`,
    campaign: affiliateCode,
    id: `${startId + i}`,
    image: `https://images.unsplash.com/photo-164997290434${i}-6e44c42644a7?w=300&h=200&fit=crop`
  }));
};

// Initial stream data (fallback)
export const initialStreams: Stream[] = [
  { room: 'alfredouihuntoui', campaign: affiliateCode, id: '1', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop' },
  { room: 'another_model_room', campaign: affiliateCode, id: '2', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop' },
];

// Hardcoded list of popular chaturbate models to use when API fails
const popularModels = [
  'asianbabydolli',
  'lilyxcx',
  'evanspicey',
  'tiffanytosh',
  'emy_naughty',
  'sofiadylan',
  'alicepettersson',
  'sweetkattye',
  'emmathompsons',
  'cherrymantra',
  'kittydirtyxxx',
  'mafiasexxx',
  'brandi_bloss',
  'hot_girlsss',
  'hot_chocolate7',
  'violetrainx',
  '_candy_mix_',
  'yin_berry',
  'sexysally30',
  'sexlovers1',
];

export const fetchChaturbateRooms = async (pageNum: number): Promise<{ streams: Stream[], error: string | null }> => {
  try {
    // Instead of using the problematic API, we'll use hardcoded popular models for now
    // In a real app, you would use a backend proxy to fetch this data properly
    
    // Get 5 models per page based on the page number
    const startIndex = (pageNum - 1) * 5;
    const endIndex = Math.min(startIndex + 5, popularModels.length);
    
    if (startIndex >= popularModels.length) {
      // No more models to show
      return { streams: [], error: null };
    }
    
    const pageModels = popularModels.slice(startIndex, endIndex);
    
    // Map the models to our Stream format
    const streams = pageModels.map((username, index) => ({
      room: username,
      campaign: affiliateCode,
      id: `model-${pageNum}-${index}`,
      // Generate a random image for the preview
      image: `https://thumbs.sb-cd.com/t/${username}/160x120/9/REPLACE_WITH_YOUR_AFFILIATE_TAG` 
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
