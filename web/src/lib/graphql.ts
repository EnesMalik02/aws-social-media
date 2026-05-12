import { api } from "./api";
import type { Post, Comment } from "./posts";

// Strawberry converts snake_case fields to camelCase in GraphQL schema
interface GQLPost {
  postId: string;
  userId: string;
  caption: string;
  imageUrl: string;
  likesCount: number;
  createdAt: string;
}

interface GQLComment {
  commentId: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
}

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const { data } = await api.post("/graphql", { query, variables });
  if (data.errors?.length) throw new Error(data.errors[0].message);
  return data.data as T;
}

function mapPost(p: GQLPost): Post {
  return {
    post_id: p.postId,
    user_id: p.userId,
    caption: p.caption,
    image_url: p.imageUrl,
    likes_count: p.likesCount,
    created_at: p.createdAt,
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
        postId
        userId
        caption
        imageUrl
        likesCount
        createdAt
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
        commentId
        postId
        userId
        text
        createdAt
      }
    }`,
    { postId }
  );
  return data.postComments.map(mapComment);
}
