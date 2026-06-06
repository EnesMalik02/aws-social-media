"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import type { Post } from "@entities/post";
import { userKeys } from "@entities/user";
import { useToggleLike } from "@features/like-post";
import { useDeletePost } from "@features/delete-post";
import { CommentModal } from "@features/comment-post";
import { HeartIcon, ChatIcon, TrashIcon, CloseIcon } from "@shared/ui/icons";

interface Props {
  posts:          Post[];
  currentUserId:  string;
}

interface PostDetailProps {
  post:          Post;
  currentUserId: string;
  onClose:       () => void;
}

function PostDetail({ post, currentUserId, onClose }: PostDetailProps) {
  const qc         = useQueryClient();
  const isLiked    = post.is_liked;
  const { username } = post;
  const toggleLike = useToggleLike();
  const deletePost = useDeletePost(currentUserId);
  const [showComments, setShowComments] = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const isOwner = post.user_id === currentUserId;

  function handleLike() {
    toggleLike.mutate({ postId: post.post_id, isLiked, userId: currentUserId });
  }

  function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    deletePost.mutate(post.post_id, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: userKeys.profile(username) });
        onClose();
      },
      onError: () => setDeleting(false),
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-[#1A1208]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        <div
          className="bg-[#FDF8F3] rounded-2xl overflow-hidden w-full max-w-lg pointer-events-auto shadow-2xl border border-[#E8D9C8]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="aspect-square w-full bg-[#EDE3D8] relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1A1208]/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#1A1208]/60 transition-colors cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="px-5 py-4">
            <p className="text-[#1A1208] text-sm leading-relaxed">{post.caption}</p>

            <div className="border-t border-[#E8D9C8] my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer group"
                >
                  <motion.span
                    key={String(isLiked)}
                    initial={{ scale: 0.75 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className={isLiked ? "text-[#FF5500]" : "text-[#C4B5A5] group-hover:text-[#FF5500] transition-colors"}
                  >
                    <HeartIcon filled={isLiked} size={16} />
                  </motion.span>
                  <span className={isLiked ? "text-[#FF5500]" : "text-[#8C7B6E]"}>
                    {post.likes_count}
                  </span>
                </button>

                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2 text-sm font-medium text-[#8C7B6E] hover:text-[#FF5500] transition-colors cursor-pointer"
                >
                  <ChatIcon size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#C4B5A5]">
                  {new Date(post.created_at).toLocaleDateString("tr-TR", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>

                {isOwner && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-[#C4B5A5] hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <TrashIcon size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showComments && (
          <CommentModal postId={post.post_id} onClose={() => setShowComments(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export function ProfilePostGrid({ posts, currentUserId }: Props) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (posts.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#E8D9C8] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="text-[#8C7B6E] font-medium text-sm">No posts yet</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((post, i) => (
          <motion.button
            key={post.post_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-square bg-[#EDE3D8] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image_url}
              alt={post.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#FF5500]/0 group-hover:bg-[#1A1208]/50 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                <HeartIcon filled size={16} />
                <span>{post.likes_count}</span>
              </div>
            </div>
            {i === 0 && (
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <PostDetail
            key={selectedPost.post_id}
            post={selectedPost}
            currentUserId={currentUserId}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
