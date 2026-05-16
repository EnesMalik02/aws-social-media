import { gql } from "@/shared/api/gql";
import type { Post } from "@/entities/post/model/types";
import type { UserProfile } from "../model/types";

interface GQLPost {
  postId: string;
  userId: string;
  caption: string;
  imageUrl: string;
  likesCount: number;
  createdAt: string;
  isLiked: boolean;
}

interface GQLUserProfile {
  userId: string;
  username: string;
  bio: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  isOwner: boolean;
  isFollowing: boolean;
  posts: GQLPost[];
}

function mapPost(p: GQLPost): Post {
  return {
    post_id: p.postId,
    user_id: p.userId,
    caption: p.caption,
    image_url: p.imageUrl,
    likes_count: p.likesCount,
    created_at: p.createdAt,
    is_liked: p.isLiked,
  };
}

const USER_PROFILE_FIELDS = `
  userId username bio avatar
  followersCount followingCount
  isOwner isFollowing
  posts { postId userId caption imageUrl likesCount createdAt isLiked }
`;

export async function fetchUserProfileByUsername(
  username: string
): Promise<UserProfile> {
  const data = await gql<{ userProfileByUsername: GQLUserProfile }>(
    `query UserProfileByUsername($username: String!) {
      userProfileByUsername(username: $username) { ${USER_PROFILE_FIELDS} }
    }`,
    { username }
  );
  const p = data.userProfileByUsername;
  return { ...p, posts: p.posts.map(mapPost) };
}
