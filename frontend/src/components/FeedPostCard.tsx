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
  avatar?: string;
}

// ── Icons ──────────────────────────────────────────────

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(dateStr).toLocaleDateString("en", { month: "short", day: "numeric" });
}

// ── Detail Modal ───────────────────────────────────────

interface DetailProps {
  post: Post;
  currentUserId: string;
  username?: string;
  avatar?: string;
  onClose: () => void;
}

function PostDetailModal({ post, currentUserId, username, avatar, onClose }: DetailProps) {
  const { likedPostIds, toggleLike, removePost } = usePostsStore();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isLiked = likedPostIds.has(post.post_id);
  const isOwner = post.user_id === currentUserId;

  async function handleLike() {
    try { await toggleLike(post.post_id, isLiked); } catch { /* ignore */ }
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await removePost(post.post_id);
      onClose();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40 bg-[#1A1208]/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 pointer-events-none"
      >
        <div
          className="bg-[#FDF8F3] rounded-t-3xl sm:rounded-2xl overflow-hidden w-full max-w-lg pointer-events-auto border border-[#E8D9C8] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-[#E8D9C8]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C7B6E] hover:bg-[#E8D9C8] transition-colors cursor-pointer flex-shrink-0"
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <Link href={username ? `/${username}` : "#"} className="flex items-center gap-2.5 group flex-1 justify-center" onClick={onClose}>
              <div className="w-8 h-8 rounded-full bg-[#EDE3D8] overflow-hidden ring-2 ring-[#FF5500]/20 group-hover:ring-[#FF5500]/50 transition-all flex-shrink-0">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#C4B5A5]">
                    {username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1208] leading-none group-hover:text-[#FF5500] transition-colors">@{username ?? "unknown"}</p>
                <p className="text-xs text-[#C4B5A5] mt-0.5">{timeAgo(post.created_at)}</p>
              </div>
            </Link>

            {/* ... menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C7B6E] hover:bg-[#E8D9C8] transition-colors cursor-pointer"
                aria-label="More options"
              >
                <DotsIcon />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 z-20 bg-[#FDF8F3] border border-[#E8D9C8] rounded-xl shadow-lg overflow-hidden min-w-[140px]"
                    >
                      {isOwner && (
                        <button
                          onClick={() => { setShowMenu(false); handleDelete(); }}
                          disabled={deleting}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <TrashIcon />
                          Delete post
                        </button>
                      )}
                      {!isOwner && (
                        <div className="px-4 py-3 text-sm text-[#C4B5A5]">No options</div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Image */}
          <div className="w-full bg-[#EDE3D8] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image_url} alt={post.caption} className="w-full object-cover" style={{ aspectRatio: "1 / 1" }} />
          </div>

          {/* Actions */}
          <div className="px-4 pt-3 pb-1 flex items-center gap-4">
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.8 }}
              className="flex items-center gap-2 cursor-pointer"
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <motion.span
                key={String(isLiked)}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                className={isLiked ? "text-[#FF5500]" : "text-[#8C7B6E]"}
              >
                <HeartIcon filled={isLiked} />
              </motion.span>
              {post.likes_count > 0 && (
                <span className={`text-sm font-semibold ${isLiked ? "text-[#FF5500]" : "text-[#8C7B6E]"}`}>
                  {post.likes_count.toLocaleString()}
                </span>
              )}
            </motion.button>

            <button
              onClick={() => setShowComments(true)}
              className="text-[#8C7B6E] hover:text-[#FF5500] transition-colors cursor-pointer"
              aria-label="Comments"
            >
              <ChatIcon />
            </button>
          </div>

          {/* Caption */}
          <div className="px-4 pt-1 pb-5">
            <p className="text-sm text-[#1A1208] leading-relaxed">
              <span className="font-semibold">@{username ?? "unknown"}</span>{" "}
              {post.caption}
            </p>
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

// ── Feed Card ──────────────────────────────────────────

export default function FeedPostCard({ post, currentUserId, username, avatar }: Props) {
  const { likedPostIds, toggleLike } = usePostsStore();
  const [showDetail, setShowDetail] = useState(false);
  const isLiked = likedPostIds.has(post.post_id);

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    try { await toggleLike(post.post_id, isLiked); } catch { /* ignore */ }
  }

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="bg-[#FDF8F3] border border-[#E8D9C8] rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href={username ? `/${username}` : "#"} className="flex items-center gap-3 group flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#EDE3D8] flex-shrink-0 overflow-hidden ring-2 ring-[#FF5500]/20 group-hover:ring-[#FF5500]/50 transition-all">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#C4B5A5]">
                  {username?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1A1208] leading-none group-hover:text-[#FF5500] transition-colors truncate">
                @{username ?? "unknown"}
              </p>
              <p className="text-xs text-[#C4B5A5] mt-0.5">{timeAgo(post.created_at)}</p>
            </div>
          </Link>
        </div>

        {/* Image — tapping opens detail */}
        <button
          onClick={() => setShowDetail(true)}
          className="w-full bg-[#EDE3D8] overflow-hidden block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
          aria-label="View post details"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full object-cover hover:opacity-95 transition-opacity"
            style={{ aspectRatio: "1 / 1" }}
          />
        </button>

        {/* Actions */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-5">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.82 }}
            className="flex items-center gap-2 cursor-pointer"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <motion.span
              key={String(isLiked)}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              className={isLiked ? "text-[#FF5500]" : "text-[#8C7B6E]"}
            >
              <HeartIcon filled={isLiked} />
            </motion.span>
          </motion.button>

          <button
            onClick={() => setShowDetail(true)}
            className="text-[#8C7B6E] hover:text-[#FF5500] transition-colors cursor-pointer"
            aria-label="View comments"
          >
            <ChatIcon />
          </button>
        </div>

        {/* Like count */}
        {post.likes_count > 0 && (
          <p className="px-4 text-sm font-bold text-[#1A1208]">
            {post.likes_count.toLocaleString()} {post.likes_count === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Caption — Instagram style: username own line, caption below */}
        <div className="px-4 pt-2 pb-4">
          <Link
            href={username ? `/${username}` : "#"}
            className="text-sm font-bold text-[#1A1208] hover:text-[#FF5500] transition-colors leading-snug block"
          >
            @{username ?? "unknown"}
          </Link>
          <button
            onClick={() => setShowDetail(true)}
            className="text-left text-sm text-[#4A3F36] leading-relaxed mt-0.5 cursor-pointer hover:opacity-80 transition-opacity block w-full"
          >
            {post.caption.length > 100 ? post.caption.slice(0, 100) + "…" : post.caption}
          </button>
        </div>
      </motion.article>

      <AnimatePresence>
        {showDetail && (
          <PostDetailModal
            post={post}
            currentUserId={currentUserId}
            username={username}
            avatar={avatar}
            onClose={() => setShowDetail(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
