"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

export default function FeedPage() {
  const router = useRouter();
  const { user, loading, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!user) fetchMe();
  }, [user, fetchMe, router]);

  if (loading || !user) {
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
          <span className="text-[#FF5500] font-black text-xl tracking-tight">
            Pixora
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#1A1208]">
              @{user.username}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF5500] border border-[#FF5500]/30 hover:bg-[#FF5500]/10 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FDF8F3] border border-[#E8D9C8] rounded-2xl p-6 mb-6"
        >
          <p className="text-xs font-semibold text-[#FF5500] uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="text-2xl font-bold text-[#0D0D0D]">
            Hey, {user.username} 👋
          </h1>
          <p className="mt-1 text-[#8C7B6E] text-sm">{user.email}</p>
        </motion.div>

        <p className="text-center text-[#C4B5A5] text-sm mt-16">
          Feed coming soon — the good stuff is being built.
        </p>
      </main>
    </div>
  );
}
