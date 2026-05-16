"use client";

import { useFollow } from "@/entities/user/queries";
import type { UserProfile } from "@/entities/user/model/types";

interface Props {
  profile: UserProfile;
  isAuthenticated: boolean;
}

export default function ProfileActions({ profile, isAuthenticated }: Props) {
  const { mutate: toggleFollow, isPending } = useFollow(profile.username);

  if (!profile.isOwner && isAuthenticated) {
    return (
      <button
        onClick={() =>
          toggleFollow({ userId: profile.userId, isFollowing: profile.isFollowing })
        }
        disabled={isPending}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
          profile.isFollowing
            ? "bg-[#EDE3D8] text-[#1A1208] hover:bg-[#E8D9C8]"
            : "bg-[#FF5500] text-white hover:bg-[#e64d00] shadow-md shadow-[#FF5500]/20"
        }`}
      >
        {profile.isFollowing ? "Unfollow" : "Follow"}
      </button>
    );
  }

  if (profile.isOwner) {
    return (
      <button className="w-full py-2.5 rounded-xl text-sm font-bold border border-[#E8D9C8] text-[#1A1208] hover:bg-[#EDE3D8] transition-colors cursor-pointer">
        Edit profile
      </button>
    );
  }

  return null;
}
