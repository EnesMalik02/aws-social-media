import { create } from "zustand";

interface LikeState {
  likedPostIds: Set<string>;
  add: (postId: string) => void;
  remove: (postId: string) => void;
  has: (postId: string) => boolean;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedPostIds: new Set(),
  add: (postId) =>
    set((s) => ({ likedPostIds: new Set([...s.likedPostIds, postId]) })),
  remove: (postId) =>
    set((s) => {
      const next = new Set(s.likedPostIds);
      next.delete(postId);
      return { likedPostIds: next };
    }),
  has: (postId) => get().likedPostIds.has(postId),
}));
