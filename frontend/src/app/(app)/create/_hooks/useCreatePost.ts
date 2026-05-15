"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/entities/user/store/authStore";
import { useCreatePostMutation } from "@/entities/post/queries";

export function useCreatePost() {
  const router = useRouter();
  const { user, fetchMe } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const createMutation = useCreatePostMutation(user?.user_id);

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
    if (!file || !caption.trim() || createMutation.isPending) return;
    createMutation.mutate(
      { file, caption: caption.trim() },
      { onSuccess: () => router.push("/feed") }
    );
  }

  return {
    fileRef,
    preview,
    file,
    caption,
    setCaption,
    uploading: createMutation.isPending,
    handleFileChange,
    clearImage,
    handleSubmit,
  };
}
