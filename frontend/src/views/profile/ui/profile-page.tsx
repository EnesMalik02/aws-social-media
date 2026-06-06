"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore, useUserProfile } from "@entities/user";
import { useAuthGuard } from "@features/auth";
import { Navbar } from "@widgets/navbar";
import { Spinner } from "@shared/ui/spinner";
import { BackIcon, AlertIcon } from "@shared/ui/icons";
import { ProfileHero } from "./profile-hero";
import { ProfileActions } from "./profile-actions";
import { PostsSection } from "./posts-section";

export function ProfilePage() {
  const params   = useParams();
  const username = params.username as string;

  const { user } = useAuthGuard();
  const { data: profile, isLoading, isError } = useUserProfile(username);

  const authUser = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0] lg:pl-60">
        <Spinner />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#F5EDE0] lg:pl-60 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FDF8F3] border border-[#E8D9C8] flex items-center justify-center">
          <AlertIcon />
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

        <PostsSection posts={profile.posts} currentUserId={authUser?.user_id ?? ""} />
      </main>

      <Navbar username={authUser?.username} />
    </div>
  );
}
