"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFollowers, useFollowing } from "@/entities/user/queries";

interface Props {
  userId: string;
  tab: "followers" | "following";
  onClose: () => void;
}

function UserRow({ username, avatar }: { username: string; avatar: string }) {
  return (
    <Link
      href={`/${username}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-[#EDE3D8] transition-colors rounded-xl"
    >
      <div className="w-10 h-10 rounded-full bg-[#EDE3D8] overflow-hidden flex-shrink-0 border border-[#E8D9C8]">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-black text-[#FF5500]">
            {username[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <span className="text-sm font-semibold text-[#1A1208]">@{username}</span>
    </Link>
  );
}

export default function FollowListModal({ userId, tab, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const followers = useFollowers(userId, tab === "followers");
  const following = useFollowing(userId, tab === "following");

  const { data, isLoading } = tab === "followers" ? followers : following;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full sm:w-96 max-h-[70vh] bg-[#FDF8F3] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E8D9C8]">
            <h2 className="text-[15px] font-black text-[#1A1208]">
              {tab === "followers" ? "Followers" : "Following"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#8C7B6E] hover:bg-[#EDE3D8] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 p-2">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin" />
              </div>
            ) : !data?.length ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <p className="text-sm text-[#8C7B6E] font-medium">
                  {tab === "followers" ? "No followers yet" : "Not following anyone yet"}
                </p>
              </div>
            ) : (
              data.map((u) => (
                <UserRow key={u.user_id} username={u.username} avatar={u.avatar} />
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
