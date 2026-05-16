"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "@/entities/post/model/types";
import {
  useToggleLikeMutation,
  useDeletePostMutation,
} from "@/entities/post/queries";
import CommentModal from "./CommentModal";

interface Props {
  post: Post;
  currentUserId: string;
  username?: string;
}

export default function PostCard({ post, currentUserId, username }: Props) {
  const isLiked = post.is_liked;
  const toggleLike = useToggleLikeMutation();
  const deletePost = useDeletePostMutation(currentUserId);
  const [showComments, setShowComments] = useState(false);
  const isOwner = post.user_id === currentUserId;

  function handleLike() {
    toggleLike.mutate({ postId: post.post_id, isLiked, userId: currentUserId });
  }

  function handleDelete() {
    if (!confirm("Delete this post?")) return;
    deletePost.mutate(post.post_id);
  }

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#FDF8F3] border border-[#E8D9C8] rounded-2xl overflow-hidden"
      >
        <div className="aspect-square w-full bg-[#EDE3D8] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover" />
        </div>

        <div className="p-4">
          {username && (
            <Link
              href={`/${username}`}
              className="text-sm font-bold text-[#1A1208] hover:text-[#FF5500] transition-colors block leading-snug mb-0.5"
            >
              @{username}
            </Link>
          )}
          <p className="text-[#4A3F36] text-sm leading-relaxed mb-3">{post.caption}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className="flex items-center gap-1.5 text-sm font-medium transition-colors">
                <motion.span
                  key={String(isLiked)}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={isLiked ? "text-[#FF5500]" : "text-[#C4B5A5]"}
                >
                  {isLiked ? "♥" : "♡"}
                </motion.span>
                <span className={isLiked ? "text-[#FF5500]" : "text-[#8C7B6E]"}>
                  {post.likes_count}
                </span>
              </button>

              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#8C7B6E] hover:text-[#FF5500] transition-colors"
              >
                <span>💬</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#C4B5A5]">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={deletePost.isPending}
                  className="text-xs text-[#C4B5A5] hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {showComments && (
          <CommentModal postId={post.post_id} onClose={() => setShowComments(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
