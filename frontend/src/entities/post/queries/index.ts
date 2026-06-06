import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchUserPosts, fetchPostComments, fetchFeed, fetchDiscover } from "../api/graphql";
import type { FeedResponse, DiscoverResponse } from "../api/graphql";
import {
  getUploadUrl,
  uploadToS3,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
} from "../api/rest";
import type { Post } from "../model/types";

export const postKeys = {
  byUser: (userId: string) => ["posts", "user", userId] as const,
  comments: (postId: string) => ["posts", "comments", postId] as const,
  feed: () => ["posts", "feed"] as const,
  discover: () => ["posts", "discover"] as const,
};

export function useFeed() {
  return useQuery<FeedResponse>({
    queryKey: postKeys.feed(),
    queryFn: () => fetchFeed(),
    staleTime: 60 * 1000,
  });
}

export function useDiscover() {
  return useQuery<DiscoverResponse>({
    queryKey: postKeys.discover(),
    queryFn: () => fetchDiscover(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: postKeys.byUser(userId ?? ""),
    queryFn: () => fetchUserPosts(userId!),
    enabled: !!userId,
    staleTime: 60 * 1000,
    select: (posts) =>
      [...posts].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: () => fetchPostComments(postId),
    staleTime: 30 * 1000,
  });
}

export function useCreatePostMutation(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, caption }: { file: File; caption: string }) => {
      const { upload_url, image_url } = await getUploadUrl(file.name, file.type);
      await uploadToS3(upload_url, file);
      return createPost(caption, image_url);
    },
    onSuccess: () => {
      if (userId) qc.invalidateQueries({ queryKey: postKeys.byUser(userId) });
    },
  });
}

export function useDeletePostMutation(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      if (userId) qc.invalidateQueries({ queryKey: postKeys.byUser(userId) });
    },
  });
}

export function useToggleLikeMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      isLiked,
    }: {
      postId: string;
      isLiked: boolean;
      userId: string;
    }) => (isLiked ? unlikePost(postId) : likePost(postId)),

    onMutate: ({ postId, isLiked, userId }) => {
      const key = postKeys.byUser(userId);
      const previous = qc.getQueryData<Post[]>(key);

      qc.setQueryData<Post[]>(key, (old) => {
        if (!old) return old;
        return old.map((p) =>
          p.post_id === postId
            ? {
                ...p,
                is_liked: !isLiked,
                likes_count: p.likes_count + (isLiked ? -1 : 1),
              }
            : p
        );
      });

      return { previous, key };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(ctx.key, ctx.previous);
    },
  });
}

export function useAddCommentMutation(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => addComment(postId, text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.comments(postId) });
    },
  });
}
