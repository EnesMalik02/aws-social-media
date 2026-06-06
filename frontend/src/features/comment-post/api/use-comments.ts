import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPostComments, addComment, postKeys } from "@entities/post";

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn:  () => fetchPostComments(postId),
    staleTime: 30 * 1000,
  });
}

export function useAddComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => addComment(postId, text),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: postKeys.comments(postId) });
    },
  });
}
