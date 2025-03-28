export interface Post {
    id: string;
    text: string;
    image?: string;
    date: string;
    user_id: string; 
    users?: {
      username: string;
      profile_picture: string;
    };
    likes?: { count: number }[];
    comments?: { count: number }[];
}