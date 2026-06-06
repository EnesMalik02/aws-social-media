"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFeed } from "@entities/post";
import { useAuthGuard } from "@features/auth";
import { PostCard } from "@widgets/post-card";
import { Navbar } from "@widgets/navbar";
import { SkeletonCard } from "@shared/ui/skeleton-card";
import { Spinner } from "@shared/ui/spinner";

export function FeedPage() {
  const { user, loading: authLoading } = useAuthGuard();
  const { data: feedData, isLoading: feedLoading } = useFeed();

  const posts   = feedData?.posts ?? [];
  const hasMore = feedData?.hasMore ?? true;

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
        {feedLoading ? (
          <div className="space-y-0">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center py-32 gap-4 px-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#FDF8F3] border border-[#E8D9C8] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#1A1208]">Henüz Bir Post Yok</p>
              <p className="text-sm text-[#8C7B6E] mt-1">Takip ettiğin kişilerin postları burada görünecek</p>
            </div>
            <Link
              href="/discover"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5500] text-white text-sm font-semibold hover:bg-[#e64d00] active:scale-[0.97] transition-all shadow-md shadow-[#FF5500]/25"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Discover people
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-3 px-4 pt-4">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} currentUserId={user.user_id} />
              ))}
              {!hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-3 py-8"
                >
                  <p className="text-sm text-[#8C7B6E]">You&apos;re all caught up</p>
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8D9C8] bg-[#FDF8F3] text-sm font-semibold text-[#FF5500] hover:bg-[#EDE3D8] active:scale-[0.97] transition-all"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Explore more posts
                  </Link>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        )}
      </main>

      <Navbar username={user.username} />
    </div>
  );
}
