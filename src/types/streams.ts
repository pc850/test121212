
export interface Stream {
  room: string;
  campaign: string;
  id: string;
  image?: string; // Optional preview image
}

export interface ChaturbateRoom {
  username: string;
  current_show: string;
  num_users: number;
  num_followers: number;
  display_name: string;
  gender: string;
  tags: string[];
  image_url: string;
  is_hd: boolean;
}
