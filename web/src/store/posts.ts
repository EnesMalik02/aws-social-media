"use client";

import { create } from "zustand";
import type { Post, Comment } from "@/lib/posts";
import { fetchUserPosts } from "@/lib/graphql";
import { likePost, unlikePost, deletePost } from "@/lib/posts";

interface PostsState {
  posts: Post[];
  likedPostIds: Set<string>;
  loading: boolean;
  loadPosts: (userId: string) => Promise<void>;
  addPost: (post: Post) => void;
  removePost: (postId: string) => void;
  toggleLike: (postId: string, currentlyLiked: boolean) => Promise<void>;
  addComment: (postId: string, comment: Comment) => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  likedPostIds: new Set(),
  loading: false,

  loadPosts: async (userId: string) => {
    set({ loading: true });
    try {
      const posts = await fetchUserPosts(userId);
      set({ posts: posts.sort((a, b) => b.created_at.localeCompare(a.created_at)) });
    } finally {
      set({ loading: false });
    }
  },

  addPost: (post) => set((s) => ({ posts: [post, ...s.posts] })),

  removePost: async (postId) => {
    await deletePost(postId);
    set((s) => ({ posts: s.posts.filter((p) => p.post_id !== postId) }));
  },

  toggleLike: async (postId, currentlyLiked) => {
    const { likedPostIds } = get();
    const next = new Set(likedPostIds);
    if (currentlyLiked) {
      await unlikePost(postId);
      next.delete(postId);
      set((s) => ({
        likedPostIds: next,
        posts: s.posts.map((p) =>
          p.post_id === postId ? { ...p, likes_count: p.likes_count - 1 } : p
        ),
      }));
    } else {
      await likePost(postId);
      next.add(postId);
      set((s) => ({
        likedPostIds: next,
        posts: s.posts.map((p) =>
          p.post_id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
        ),
      }));
    }
  },

  addComment: (postId, comment) => {
    void postId;
    void comment;
  },
}));
