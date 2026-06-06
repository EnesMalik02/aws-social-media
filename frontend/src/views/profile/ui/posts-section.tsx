"use client";

import { motion } from "framer-motion";
import type { Post } from "@entities/post";
import { ProfilePostGrid } from "@widgets/profile-post-grid";
import { GridIcon } from "@shared/ui/icons";

interface Props {
  posts:         Post[];
  currentUserId: string;
}

export function PostsSection({ posts, currentUserId }: Props) {
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
        <ProfilePostGrid posts={posts} currentUserId={currentUserId} />
      </motion.div>
    </>
  );
}
