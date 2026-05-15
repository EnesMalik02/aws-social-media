"use client";

import { useEffect, useState } from "react";
import { fetchUserProfileByUsername, type UserProfile } from "@/lib/graphql";

export function useProfile(username: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    fetchUserProfileByUsername(username)
      .then(setProfile)
      .catch(() => setError("User not found"))
      .finally(() => setLoading(false));
  }, [username]);

  return { profile, loading, error };
}
