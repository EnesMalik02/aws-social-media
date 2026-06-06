"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePostComments, useAddComment } from "../api/use-comments";

interface Props {
  postId:  string;
  onClose: () => void;
}

export function CommentModal({ postId, onClose }: Props) {
  const [text, setText]   = useState("");
  const inputRef          = useRef<HTMLInputElement>(null);

  const { data: comments = [], isLoading } = usePostComments(postId);
  const addComment = useAddComment(postId);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || addComment.isPending) return;
    addComment.mutate(text.trim(), { onSuccess: () => setText("") });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#FDF8F3] rounded-t-3xl border-t border-[#E8D9C8] max-h-[70vh] flex flex-col"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-[#E8D9C8]" />
        </div>

        <div className="px-4 pb-2 flex items-center justify-between">
          <h2 className="font-semibold text-[#1A1208]">Comments</h2>
          <button onClick={onClose} className="text-[#8C7B6E] text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin" />
            </div>
          )}
          {!isLoading && comments.length === 0 && (
            <p className="text-center text-[#C4B5A5] text-sm py-8">No comments yet.</p>
          )}
          {comments.map((c) => (
            <div key={c.comment_id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#E8D9C8] flex items-center justify-center text-xs font-bold text-[#8C7B6E] flex-shrink-0">
                {c.user_id.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#FF5500] mb-0.5">{c.user_id.slice(0, 8)}</p>
                <p className="text-sm text-[#1A1208]">{c.text}</p>
                <p className="text-xs text-[#C4B5A5] mt-0.5">
                  {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-[#E8D9C8] flex gap-2">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-[#F5EDE0] border border-[#E8D9C8] rounded-xl px-3 py-2 text-sm text-[#1A1208] placeholder-[#C4B5A5] outline-none focus:border-[#FF5500]/50"
          />
          <button
            type="submit"
            disabled={!text.trim() || addComment.isPending}
            className="px-4 py-2 rounded-xl bg-[#FF5500] text-white text-sm font-semibold disabled:opacity-40 transition-opacity"
          >
            Post
          </button>
        </form>
      </motion.div>
    </>
  );
}
