"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePostMutation } from "../api/use-create-post-mutation";

export function useCreatePost(userId: string | undefined) {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file,    setFile]    = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const createMutation = useCreatePostMutation(userId);

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

  function handleSubmit(e: React.FormEvent) {
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
