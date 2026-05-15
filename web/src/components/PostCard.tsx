"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "@/lib/posts";
import { usePostsStore } from "@/store/posts";
import CommentModal from "./CommentModal";

interface Props {
  post: Post;
  currentUserId: string;
  username?: string;
}

export default function PostCard({ post, currentUserId, username }: Props) {
  const { likedPostIds, toggleLike, removePost } = usePostsStore();
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isLiked = likedPostIds.has(post.post_id);
  const isOwner = post.user_id === currentUserId;

  async function handleLike() {
    try {
      await toggleLike(post.post_id, isLiked);
    } catch {
      // already liked/unliked — ignore
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await removePost(post.post_id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: deleting ? 0 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#FDF8F3] border border-[#E8D9C8] rounded-2xl overflow-hidden"
      >
        {/* Post header — only when username provided */}
        {username && (
          <div className="px-4 pt-3 pb-1">
            <Link
              href={`/${username}`}
              className="text-sm font-semibold text-[#1A1208] hover:text-[#FF5500] transition-colors"
            >
              @{username}
            </Link>
          </div>
        )}

        {/* Image */}
        <div className="aspect-square w-full bg-[#EDE3D8] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-[#1A1208] text-sm leading-relaxed mb-3">{post.caption}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Like */}
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
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

              {/* Comment */}
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
                  disabled={deleting}
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
