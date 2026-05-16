export interface Post {
  post_id: string;
  user_id: string;
  username: string;
  avatar: string;
  caption: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  is_liked: boolean;
}

export interface Comment {
  comment_id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string;
}
