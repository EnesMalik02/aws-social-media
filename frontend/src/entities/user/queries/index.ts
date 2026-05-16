import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, followUser, unfollowUser, fetchFollowers, fetchFollowing } from "../api/rest";
import { fetchUserProfileByUsername } from "../api/graphql";
import type { UserProfile } from "../model/types";

export const userKeys = {
  me: ["user", "me"] as const,
  profile: (username: string) => ["user", "profile", username] as const,
  followers: (userId: string) => ["user", "followers", userId] as const,
  following: (userId: string) => ["user", "following", userId] as const,
};

export function useMe(enabled = true) {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: fetchMe,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn: () => fetchUserProfileByUsername(username),
    enabled: !!username,
    staleTime: 2 * 60 * 1000,
  });
}

export function useFollowers(userId: string, enabled = false) {
  return useQuery({
    queryKey: userKeys.followers(userId),
    queryFn: () => fetchFollowers(userId),
    enabled: !!userId && enabled,
    staleTime: 60 * 1000,
  });
}

export function useFollowing(userId: string, enabled = false) {
  return useQuery({
    queryKey: userKeys.following(userId),
    queryFn: () => fetchFollowing(userId),
    enabled: !!userId && enabled,
    staleTime: 60 * 1000,
  });
}

export function useFollow(username: string) {
  const qc = useQueryClient();
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
              isFollowing: !isFollowing,
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
