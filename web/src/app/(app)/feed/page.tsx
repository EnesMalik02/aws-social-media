"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { usePostsStore } from "@/store/posts";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";

export default function FeedPage() {
  const router = useRouter();
  const { user, loading: authLoading, fetchMe, logout } = useAuthStore();
  const { posts, loading: postsLoading, loadPosts } = usePostsStore();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!user) fetchMe();
  }, [user, fetchMe, router]);

  useEffect(() => {
    if (user) loadPosts(user.user_id);
  }, [user, loadPosts]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <div className="w-8 h-8 border-3 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE0]">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-[#F5EDE0]/80 backdrop-blur-md border-b border-[#E8D9C8]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-[#FF5500] font-black text-xl tracking-tight">Pixora</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#1A1208]">@{user.username}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF5500] border border-[#FF5500]/30 hover:bg-[#FF5500]/10 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#FDF8F3] border border-[#E8D9C8] rounded-2xl p-5 mb-6 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-[#FF5500] uppercase tracking-widest mb-0.5">
              Your feed
            </p>
            <h1 className="text-xl font-bold text-[#0D0D0D]">Hey, {user.username} 👋</h1>
            <p className="text-[#8C7B6E] text-sm mt-0.5">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="w-11 h-11 rounded-2xl bg-[#FF5500] text-white flex items-center justify-center text-2xl font-light shadow-sm hover:bg-[#e64d00] transition-colors"
          >
            +
          </button>
        </motion.div>

        {/* Posts */}
        {postsLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-3">📷</p>
            <p className="text-[#8C7B6E] font-medium">No posts yet</p>
            <p className="text-[#C4B5A5] text-sm mt-1">Share your first moment</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} currentUserId={user.user_id} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>

      {/* FAB mobile */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-[#FF5500] text-white text-3xl flex items-center justify-center shadow-lg hover:bg-[#e64d00] transition-colors md:hidden"
      >
        +
      </button>

      <AnimatePresence>
        {showCreate && <CreatePost onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
