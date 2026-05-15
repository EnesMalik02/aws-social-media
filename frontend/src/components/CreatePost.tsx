"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/entities/user/store/authStore";
import { useCreatePostMutation } from "@/entities/post/queries";

interface Props {
  onClose: () => void;
}

export default function CreatePost({ onClose }: Props) {
  const { user } = useAuthStore();
  const createMutation = useCreatePostMutation(user?.user_id);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [step, setStep] = useState<"pick" | "caption">("pick");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStep("caption");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !caption.trim() || createMutation.isPending) return;
    createMutation.mutate({ file, caption: caption.trim() }, { onSuccess: onClose });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-[#FDF8F3] rounded-3xl border border-[#E8D9C8] p-6 max-w-sm mx-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#1A1208] text-lg">New Post</h2>
          <button onClick={onClose} className="text-[#8C7B6E] text-xl">✕</button>
        </div>

        {step === "pick" && (
          <div
            onClick={() => fileRef.current?.click()}
            className="aspect-square w-full rounded-2xl bg-[#F5EDE0] border-2 border-dashed border-[#E8D9C8] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FF5500]/40 transition-colors"
          >
            <span className="text-4xl">📷</span>
            <p className="text-sm text-[#8C7B6E] font-medium">Tap to choose photo</p>
          </div>
        )}

        {step === "caption" && preview && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#EDE3D8] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setStep("pick"); setPreview(null); setFile(null); }}
                className="absolute top-2 right-2 bg-black/40 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full bg-[#F5EDE0] border border-[#E8D9C8] rounded-xl px-3 py-2.5 text-sm text-[#1A1208] placeholder-[#C4B5A5] outline-none focus:border-[#FF5500]/50 resize-none"
            />

            <button
              type="submit"
              disabled={!caption.trim() || createMutation.isPending}
              className="w-full py-3 rounded-xl bg-[#FF5500] text-white font-bold text-sm disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                "Share Post"
              )}
            </button>
          </form>
        )}

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </motion.div>
    </>
  );
}
