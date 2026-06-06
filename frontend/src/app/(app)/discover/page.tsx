"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/entities/user/store/authStore";
import { useDiscover } from "@/entities/post/queries";
import FeedPostCard from "@/components/FeedPostCard";
import Navbar from "@/components/Navbar";

function SkeletonCard() {
  return (
    <div className="bg-[#FDF8F3] animate-pulse border border-[#E8D9C8] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-[#EDE3D8]" />
        <div className="space-y-1.5">
          <div className="w-24 h-3 rounded-full bg-[#EDE3D8]" />
          <div className="w-14 h-2.5 rounded-full bg-[#EDE3D8]" />
        </div>
      </div>
      <div className="w-full aspect-square bg-[#EDE3D8]" />
      <div className="px-4 py-3 space-y-2">
        <div className="w-16 h-3 rounded-full bg-[#EDE3D8]" />
        <div className="w-48 h-3 rounded-full bg-[#EDE3D8]" />
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading: authLoading, fetchMe } = useAuthStore();
  const { data: discoverData, isLoading } = useDiscover();

  const posts = discoverData?.posts ?? [];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!user) fetchMe();
  }, [user, fetchMe, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <div className="w-8 h-8 border-2 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F5EDE0] lg:pl-60">
      <main className="max-w-xl mx-auto pt-4 pb-28 lg:pb-8">
        <div className="px-4 pb-3">
          <h1 className="text-xl font-black text-[#1A1208] tracking-tight">
            Discover
          </h1>
          <p className="text-xs text-[#8C7B6E] mt-0.5">All posts, newest first</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3 px-4">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
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
                <FeedPostCard
                  key={post.post_id}
                  post={post}
                  currentUserId={user.user_id}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>

      <Navbar username={user.username} />
    </div>
  );
}
