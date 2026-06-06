import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, postKeys } from "@entities/post";

export function useDeletePost(userId: string | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      if (userId) qc.invalidateQueries({ queryKey: postKeys.byUser(userId) });
    },
  });
}
