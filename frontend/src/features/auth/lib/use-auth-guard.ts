"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@entities/user";

export function useAuthGuard() {
  const router                      = useRouter();
  const { user, loading, fetchMe }  = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!user) fetchMe();
  }, [user, fetchMe, router]);

  return { user, loading };
}
