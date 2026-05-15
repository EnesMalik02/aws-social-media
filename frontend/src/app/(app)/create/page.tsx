"use client";

import { useRouter } from "next/navigation";
import { useCreatePost } from "./_hooks/useCreatePost";
import { ImagePicker } from "./_components/ImagePicker";
import { CaptionPanel } from "./_components/CaptionPanel";

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const { fileRef, preview, file, caption, setCaption, uploading, handleFileChange, clearImage, handleSubmit } = useCreatePost();

  return (
    <div className="min-h-dvh bg-[#F5EDE0] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-[#FDF8F3] border border-[#E8D9C8] flex items-center justify-center text-[#8C7B6E] hover:bg-[#EDE3D8] transition-colors"
          >
            <BackIcon />
          </button>
          <h1 className="font-bold text-[#1A1208] text-xl">New Post</h1>
        </div>

        {/* Two-column form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5 items-stretch">
          <div className="w-full md:w-1/2">
            <ImagePicker preview={preview} fileRef={fileRef} onClear={clearImage} onChange={handleFileChange} />
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
