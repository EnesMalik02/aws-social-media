import { gql } from "@/shared/api/gql";
import type { Post, Comment } from "../model/types";

interface GQLPost {
  postId: string;
  userId: string;
  username: string;
  avatar: string;
  caption: string;
  imageUrl: string;
  likesCount: number;
  createdAt: string;
  isLiked: boolean;
}

interface GQLComment {
  commentId: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
}

function mapPost(p: GQLPost): Post {
  return {
    post_id: p.postId,
    user_id: p.userId,
    username: p.username,
    avatar: p.avatar,
    caption: p.caption,
    image_url: p.imageUrl,
    likes_count: p.likesCount,
    created_at: p.createdAt,
    is_liked: p.isLiked,
  };
}

function mapComment(c: GQLComment): Comment {
  return {
    comment_id: c.commentId,
    post_id: c.postId,
    user_id: c.userId,
    text: c.text,
    created_at: c.createdAt,
  };
}

export async function fetchUserPosts(userId: string): Promise<Post[]> {
  const data = await gql<{ userPosts: GQLPost[] }>(
    `query UserPosts($userId: String!) {
      userPosts(userId: $userId) {
        postId userId username avatar caption imageUrl likesCount createdAt isLiked
      }
    }`,
    { userId }
  );
  return data.userPosts.map(mapPost);
}

export async function fetchPostComments(postId: string): Promise<Comment[]> {
  const data = await gql<{ postComments: GQLComment[] }>(
    `query PostComments($postId: String!) {
      postComments(postId: $postId) {
        commentId postId userId text createdAt
      }
    }`,
    { postId }
  );
  return data.postComments.map(mapComment);
}
