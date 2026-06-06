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

export interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface GQLFeedResponse {
  feed: {
    posts: GQLPost[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export async function fetchFeed(cursor?: string): Promise<FeedResponse> {
  const data = await gql<GQLFeedResponse>(
    `query Feed($cursor: String) {
      feed(cursor: $cursor) {
        posts { postId userId username avatar caption imageUrl likesCount createdAt isLiked }
        nextCursor
        hasMore
      }
    }`,
    { cursor: cursor ?? null }
  );
  return {
    posts: data.feed.posts.map(mapPost),
    nextCursor: data.feed.nextCursor,
    hasMore: data.feed.hasMore,
  };
}

export interface DiscoverResponse {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface GQLDiscoverPost {
  postId:          string;
  userId:          string;
  caption:         string;
  imageUrl:        string;
  likesCount:      number;
  createdAt:       string;
  authorUsername:  string;
  authorAvatar:    string;
}

interface GQLDiscoverResponse {
  discover: {
    posts:       GQLDiscoverPost[];
    nextCursor:  string | null;
    hasMore:     boolean;
  };
}

export async function fetchDiscover(cursor?: string): Promise<DiscoverResponse> {
  const data = await gql<GQLDiscoverResponse>(
    `query Discover($cursor: String) {
      discover(cursor: $cursor) {
        posts { postId userId caption imageUrl likesCount createdAt authorUsername authorAvatar }
        nextCursor
        hasMore
      }
    }`,
    { cursor: cursor ?? null }
  );
  return {
    posts: data.discover.posts.map((p) => ({
      post_id:     p.postId,
      user_id:     p.userId,
      username:    p.authorUsername,
      avatar:      p.authorAvatar,
      caption:     p.caption,
      image_url:   p.imageUrl,
      likes_count: p.likesCount,
      created_at:  p.createdAt,
      is_liked:    false,
    })),
    nextCursor: data.discover.nextCursor,
    hasMore:    data.discover.hasMore,
  };
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
