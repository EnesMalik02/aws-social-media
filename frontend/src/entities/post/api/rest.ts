import { apiClient } from "@/shared/api/client";
import type { Post, Comment } from "../model/types";

export async function getUploadUrl(
  filename: string
): Promise<{ upload_url: string; image_url: string }> {
  const { data } = await apiClient.get("/v1/posts/upload-url", {
    params: { filename },
  });
  return data;
}

export async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
}

export async function createPost(
  caption: string,
  image_url: string
): Promise<Post> {
  const { data } = await apiClient.post("/v1/posts/", { caption, image_url });
  return data;
}

export async function deletePost(postId: string): Promise<void> {
  await apiClient.delete(`/v1/posts/${postId}`);
}

export async function likePost(postId: string): Promise<void> {
  await apiClient.post(`/v1/posts/${postId}/like`);
}

export async function unlikePost(postId: string): Promise<void> {
  await apiClient.delete(`/v1/posts/${postId}/like`);
}

export async function addComment(
  postId: string,
  text: string
): Promise<Comment> {
  const { data } = await apiClient.post(`/v1/posts/${postId}/comments`, {
    text,
  });
  return data;
}
