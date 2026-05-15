"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { usePostsStore } from "@/store/posts";
import { getUploadUrl, uploadToS3, createPost } from "@/lib/posts";

export function useCreatePost() {
  const router = useRouter();
  const { user, fetchMe } = useAuthStore();
  const { addPost } = usePostsStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    if (!user) fetchMe();
  }, [user, fetchMe, router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function clearImage() {
    setPreview(null);
    setFile(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !caption.trim() || uploading) return;
    setUploading(true);
    try {
      const { upload_url, image_url } = await getUploadUrl(file.name);
      await uploadToS3(upload_url, file);
      const post = await createPost(caption.trim(), image_url);
      addPost(post);
      router.push("/feed");
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  }

  return { fileRef, preview, file, caption, setCaption, uploading, handleFileChange, clearImage, handleSubmit };
}
