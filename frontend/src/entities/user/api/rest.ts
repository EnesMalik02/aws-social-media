import { apiClient } from "@/shared/api/client";
import type { User } from "../model/types";

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get("/v1/auth/me");
  return data;
}

export interface FollowStatusResponse {
  following: boolean;
  followers_count: number;
}

export async function followUser(userId: string): Promise<FollowStatusResponse> {
  const { data } = await apiClient.post(`/v1/users/${userId}/follow`);
  return data;
}

export async function unfollowUser(userId: string): Promise<FollowStatusResponse> {
  const { data } = await apiClient.delete(`/v1/users/${userId}/follow`);
  return data;
}

export interface FollowUser {
  user_id: string;
  username: string;
  avatar: string;
}

export async function fetchFollowers(userId: string): Promise<FollowUser[]> {
  const { data } = await apiClient.get(`/v1/users/${userId}/followers`);
  return data;
}

export async function fetchFollowing(userId: string): Promise<FollowUser[]> {
  const { data } = await apiClient.get(`/v1/users/${userId}/following`);
  return data;
}
