"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { fetchUserProfileByUsername, type UserProfile } from "@/lib/graphql";
import ProfilePostGrid from "@/components/ProfilePostGrid";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user, fetchMe } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!user) fetchMe();
  }, [user, fetchMe, router]);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    fetchUserProfileByUsername(username)
      .then(setProfile)
      .catch(() => setError("User not found"))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <div className="w-8 h-8 border-3 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F5EDE0] flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">😕</p>
        <p className="text-[#1A1208] font-semibold">User not found</p>
        <Link
          href="/feed"
          className="text-sm text-[#FF5500] font-medium hover:underline"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE0]">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-[#F5EDE0]/80 backdrop-blur-md border-b border-[#E8D9C8]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/feed"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#8C7B6E] hover:bg-[#E8D9C8] transition-colors"
          >
            ←
          </Link>
          <span className="font-bold text-[#1A1208]">@{profile.username}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#FDF8F3] border border-[#E8D9C8] rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-[#EDE3D8] flex-shrink-0 overflow-hidden">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#C4B5A5]">
                  {profile.username[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-[#0D0D0D] truncate">@{profile.username}</h1>
              {profile.bio && (
                <p className="text-sm text-[#8C7B6E] mt-1 leading-relaxed">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-4 mt-3">
                <div className="text-center">
                  <p className="text-base font-bold text-[#0D0D0D]">{profile.posts.length}</p>
                  <p className="text-xs text-[#8C7B6E]">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#0D0D0D]">{profile.followersCount}</p>
                  <p className="text-xs text-[#8C7B6E]">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#0D0D0D]">{profile.followingCount}</p>
                  <p className="text-xs text-[#8C7B6E]">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* Follow / Edit buttons */}
          {!profile.isOwner && user && (
            <div className="mt-4">
              <button className="w-full py-2 rounded-xl text-sm font-semibold bg-[#FF5500] text-white hover:bg-[#e64d00] transition-colors">
                {profile.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          )}
          {profile.isOwner && (
            <div className="mt-4">
              <button className="w-full py-2 rounded-xl text-sm font-semibold border border-[#E8D9C8] text-[#1A1208] hover:bg-[#EDE3D8] transition-colors">
                Edit profile
              </button>
            </div>
          )}
        </motion.div>

        {/* Posts grid */}
        <ProfilePostGrid
          posts={profile.posts}
          currentUserId={user?.user_id ?? ""}
        />
      </main>
    </div>
  );
}
