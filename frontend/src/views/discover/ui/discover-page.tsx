"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDiscover } from "@entities/post";
import { useAuthGuard } from "@features/auth";
import { PostCard } from "@widgets/post-card";
import { Navbar } from "@widgets/navbar";
import { SkeletonCard } from "@shared/ui/skeleton-card";
import { Spinner } from "@shared/ui/spinner";

export function DiscoverPage() {
  const { user, loading: authLoading } = useAuthGuard();
  const { data: discoverData, isLoading } = useDiscover();

  const posts = discoverData?.posts ?? [];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F5EDE0] lg:pl-60">
      <main className="max-w-xl mx-auto pt-4 pb-28 lg:pb-8">
        <div className="px-4 pb-3">
          <h1 className="text-xl font-black text-[#1A1208] tracking-tight">Discover</h1>
          <p className="text-xs text-[#8C7B6E] mt-0.5">All posts, newest first</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3 px-4">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} bordered />)}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#FDF8F3] border border-[#E8D9C8] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#1A1208]">No posts yet</p>
              <p className="text-sm text-[#8C7B6E] mt-1">Be the first to share something</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-3 px-4">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} currentUserId={user.user_id} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>

      <Navbar username={user.username} />
    </div>
  );
}
