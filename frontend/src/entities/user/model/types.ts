import type { Post } from "@/entities/post/model/types";

export interface User {
  user_id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  bio: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  isOwner: boolean;
  isFollowing: boolean;
  posts: Post[];
}
