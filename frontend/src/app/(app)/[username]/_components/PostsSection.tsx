"use client";

import { motion } from "framer-motion";
import ProfilePostGrid from "@/components/ProfilePostGrid";
import type { Post } from "@/entities/post/model/types";

interface Props {
  posts: Post[];
  currentUserId: string;
  ownerUsername: string;
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

export default function PostsSection({ posts, currentUserId, ownerUsername }: Props) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        className="flex items-center gap-2 mb-4 border-t border-[#E8D9C8] pt-4"
      >
        <span className="text-[#FF5500]"><GridIcon /></span>
        <span className="text-xs font-bold text-[#1A1208] tracking-widest uppercase">Posts</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <ProfilePostGrid
          posts={posts}
          currentUserId={currentUserId}
          ownerUsername={ownerUsername}
        />
      </motion.div>
    </>
  );
}
