"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/entities/user/store/authStore";
import Navbar from "@/components/Navbar";
import { useProfile } from "./_hooks/useProfile";
import ProfileHero from "./_components/ProfileHero";
import ProfileActions from "./_components/ProfileActions";
import PostsSection from "./_components/PostsSection";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user, fetchMe } = useAuthStore();
  const { profile, loading, error } = useProfile(username);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!user) fetchMe();
  }, [user, fetchMe, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0] lg:pl-60">
        <div className="w-8 h-8 border-2 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F5EDE0] lg:pl-60 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FDF8F3] border border-[#E8D9C8] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-[#1A1208] font-semibold">User not found</p>
        <Link href="/feed" className="text-sm text-[#FF5500] font-semibold hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE0] lg:pl-60 pb-24 lg:pb-8">
      <header className="sticky top-0 z-20 bg-[#F5EDE0]/85 backdrop-blur-md border-b border-[#E8D9C8]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-2">
          <Link
            href="/feed"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8C7B6E] hover:bg-[#E8D9C8] transition-colors"
            aria-label="Back to feed"
          >
            <BackIcon />
          </Link>
          <span className="font-bold text-[#1A1208] text-[15px]">@{profile.username}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-5">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 max-w-xl"
        >
          <ProfileHero profile={profile} />
          <ProfileActions profile={profile} isAuthenticated={!!user} />
        </motion.section>

        <PostsSection
          posts={profile.posts}
          currentUserId={user?.user_id ?? ""}
          ownerUsername={profile.username}
        />
      </main>

      <Navbar username={user?.username} />
    </div>
  );
}
