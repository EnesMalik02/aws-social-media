import { useQuery } from "@tanstack/react-query";
import { fetchUserPosts, fetchFeed, fetchDiscover } from "../api/graphql";
import type { FeedResponse, DiscoverResponse } from "../api/graphql";
import { postKeys } from "../lib/post-keys";

export { postKeys };

export function useFeed() {
  return useQuery<FeedResponse>({
    queryKey: postKeys.feed(),
    queryFn:  () => fetchFeed(),
    staleTime: 60 * 1000,
  });
}

export function useDiscover() {
  return useQuery<DiscoverResponse>({
    queryKey: postKeys.discover(),
    queryFn:  () => fetchDiscover(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: postKeys.byUser(userId ?? ""),
    queryFn:  () => fetchUserPosts(userId!),
    enabled:  !!userId,
    staleTime: 60 * 1000,
    select: (posts) =>
      [...posts].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  });
}
