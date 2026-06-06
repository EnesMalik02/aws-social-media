"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@features/auth";
import { useCreatePost, ImagePicker, CaptionPanel } from "@features/create-post";
import { BackIcon } from "@shared/ui/icons";

export function CreatePostPage() {
  const router          = useRouter();
  const { user }        = useAuthGuard();
  const {
    fileRef, preview, file, caption,
    setCaption, uploading, handleFileChange,
    clearImage, handleSubmit,
  } = useCreatePost(user?.user_id);

  return (
    <div className="min-h-dvh bg-[#F5EDE0] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-[#FDF8F3] border border-[#E8D9C8] flex items-center justify-center text-[#8C7B6E] hover:bg-[#EDE3D8] transition-colors"
          >
            <BackIcon size={20} />
          </button>
          <h1 className="font-bold text-[#1A1208] text-xl">New Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5 items-stretch">
          <div className="w-full md:w-1/2">
            <ImagePicker
              preview={preview}
              fileRef={fileRef}
              onClear={clearImage}
              onChange={handleFileChange}
            />
          </div>
          <div className="w-full md:w-1/2">
            <CaptionPanel
              caption={caption}
              onChange={setCaption}
              uploading={uploading}
              canSubmit={!!file && !!caption.trim() && !uploading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
