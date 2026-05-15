import { apiClient } from "@/shared/api/client";
import type { User } from "../model/types";

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get("/v1/auth/me");
  return data;
}
