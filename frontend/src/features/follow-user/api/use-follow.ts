import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser, userKeys } from "@entities/user";
import type { UserProfile } from "@entities/user";

export function useFollow(username: string) {
  const qc  = useQueryClient();
  const key = userKeys.profile(username);

  return useMutation({
    mutationFn: ({ userId, isFollowing }: { userId: string; isFollowing: boolean }) =>
      isFollowing ? unfollowUser(userId) : followUser(userId),

    onMutate: async ({ isFollowing }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<UserProfile>(key);
      qc.setQueryData<UserProfile>(key, (old) =>
        old
          ? {
              ...old,
              isFollowing:    !isFollowing,
              followersCount: old.followersCount + (isFollowing ? -1 : 1),
            }
          : old
      );
      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });
}
