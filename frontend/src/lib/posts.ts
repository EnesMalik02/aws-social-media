import { api } from "./api";

export interface Post {
  post_id: string;
  user_id: string;
  caption: string;
  image_url: string;
  likes_count: number;
  created_at: string;
}

export interface Comment {
  comment_id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export async function getUploadUrl(filename: string): Promise<{ upload_url: string; image_url: string }> {
  const { data } = await api.get("/v1/posts/upload-url", { params: { filename } });
  return data;
}

export async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
}

export async function createPost(caption: string, image_url: string): Promise<Post> {
  const { data } = await api.post("/v1/posts/", { caption, image_url });
  return data;
}

export async function deletePost(postId: string): Promise<void> {
  await api.delete(`/v1/posts/${postId}`);
}

export async function likePost(postId: string): Promise<void> {
  await api.post(`/v1/posts/${postId}/like`);
}

export async function unlikePost(postId: string): Promise<void> {
  await api.delete(`/v1/posts/${postId}/like`);
}

export async function addComment(postId: string, text: string): Promise<Comment> {
  const { data } = await api.post(`/v1/posts/${postId}/comments`, { text });
  return data;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const { data } = await api.get(`/v1/posts/${postId}/comments`);
  return data;
}
