"use client";

import { useUserProfile } from "@/entities/user/queries";

export function useProfile(username: string) {
  const { data: profile, isLoading: loading, isError } = useUserProfile(username);
  return { profile: profile ?? null, loading, error: isError ? "User not found" : null };
}
