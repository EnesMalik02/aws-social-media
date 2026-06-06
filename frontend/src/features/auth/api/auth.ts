import { apiClient } from "@shared/api/client";

export interface AuthTokens {
  access_token:  string;
  refresh_token: string;
}

export interface AuthResponse {
  token: AuthTokens;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/v1/auth/login", {
    email,
    password,
  });
  return data;
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/v1/auth/register", {
    username,
    email,
    password,
  });
  return data;
}
