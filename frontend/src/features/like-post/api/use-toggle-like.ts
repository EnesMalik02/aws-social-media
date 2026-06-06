import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost, postKeys } from "@entities/post";
import type { Post } from "@entities/post";

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      isLiked,
    }: {
      postId:  string;
      isLiked: boolean;
      userId:  string;
    }) => (isLiked ? unlikePost(postId) : likePost(postId)),

    onMutate: ({ postId, isLiked, userId }) => {
      const key      = postKeys.byUser(userId);
      const previous = qc.getQueryData<Post[]>(key);

      qc.setQueryData<Post[]>(key, (old) => {
        if (!old) return old;
        return old.map((p) =>
          p.post_id === postId
            ? {
                ...p,
                is_liked:    !isLiked,
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
