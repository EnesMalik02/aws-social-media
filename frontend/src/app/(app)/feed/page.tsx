"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/entities/user/store/authStore";
import { useUserPosts } from "@/entities/post/queries";
import FeedPostCard from "@/components/FeedPostCard";
import Navbar from "@/components/Navbar";

function SkeletonCard() {
  return (
    <div className="bg-[#FDF8F3] animate-pulse">
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
      <div className="h-px bg-[#E8D9C8]" />
    </div>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const { user, loading: authLoading, fetchMe } = useAuthStore();
  const { data: posts = [], isLoading: postsLoading } = useUserPosts(
    user?.user_id
  );

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
        {postsLoading ? (
          <div className="space-y-0">
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#1A1208]">No posts yet</p>
              <p className="text-sm text-[#8C7B6E] mt-1">Share your first moment</p>
            </div>
            <button
              onClick={() => router.push("/create")}
              className="mt-2 px-6 py-2.5 rounded-xl bg-[#FF5500] text-white text-sm font-semibold hover:bg-[#e64d00] transition-colors cursor-pointer"
            >
              Create post
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-3 px-4 pt-4">
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
