import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchUserPosts, fetchPostComments } from "../api/graphql";
import {
  getUploadUrl,
  uploadToS3,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
} from "../api/rest";
import { useLikeStore } from "../store/likeStore";
import type { Post } from "../model/types";

export const postKeys = {
  byUser: (userId: string) => ["posts", "user", userId] as const,
  comments: (postId: string) => ["posts", "comments", postId] as const,
};

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
      const { upload_url, image_url } = await getUploadUrl(file.name);
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
  const { add, remove } = useLikeStore();

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
      if (isLiked) remove(postId);
      else add(postId);

      const key = postKeys.byUser(userId);
      const previous = qc.getQueryData<Post[]>(key);

      qc.setQueryData<Post[]>(key, (old) => {
        if (!old) return old;
        return old.map((p) =>
          p.post_id === postId
            ? { ...p, likes_count: p.likes_count + (isLiked ? -1 : 1) }
            : p
        );
      });

      return { previous, key };
    },

    onError: (_err, { postId, isLiked }, ctx) => {
      if (isLiked) add(postId);
      else remove(postId);
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
