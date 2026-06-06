import { useQuery } from "@tanstack/react-query";
import { fetchMe, fetchFollowers, fetchFollowing } from "../api/rest";
import { fetchUserProfileByUsername } from "../api/graphql";
import { userKeys } from "../lib/user-keys";

export { userKeys };

export function useMe(enabled = true) {
  return useQuery({
    queryKey: userKeys.me,
    queryFn:  fetchMe,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn:  () => fetchUserProfileByUsername(username),
    enabled:  !!username,
    staleTime: 2 * 60 * 1000,
  });
}

export function useFollowers(userId: string, enabled = false) {
  return useQuery({
    queryKey: userKeys.followers(userId),
    queryFn:  () => fetchFollowers(userId),
    enabled:  !!userId && enabled,
    staleTime: 60 * 1000,
  });
}

export function useFollowing(userId: string, enabled = false) {
  return useQuery({
    queryKey: userKeys.following(userId),
    queryFn:  () => fetchFollowing(userId),
    enabled:  !!userId && enabled,
    staleTime: 60 * 1000,
  });
}
