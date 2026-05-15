import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/rest";
import { fetchUserProfileByUsername } from "../api/graphql";

export const userKeys = {
  me: ["user", "me"] as const,
  profile: (username: string) => ["user", "profile", username] as const,
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
