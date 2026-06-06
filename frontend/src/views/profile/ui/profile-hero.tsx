"use client";

import { useState } from "react";
import type { UserProfile } from "@entities/user";
import { FollowListModal } from "@features/follow-user";

interface Props {
  profile: UserProfile;
}

type FollowTab = "followers" | "following";

export function ProfileHero({ profile }: Props) {
  const [openTab, setOpenTab] = useState<FollowTab | null>(null);

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center gap-6 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-br from-[#FF5500] via-[#FF8C42] to-[#FFB347]">
              <div className="w-full h-full rounded-full bg-[#EDE3D8] overflow-hidden">
                {profile.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-[#FF5500]">
                    {profile.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-around">
            <div className="text-center">
              <p className="text-xl font-black text-[#1A1208] leading-none">{profile.posts.length}</p>
              <p className="text-xs text-[#8C7B6E] mt-1 font-medium">Posts</p>
            </div>
            <div className="w-px h-8 bg-[#E8D9C8]" />
            <button
              onClick={() => setOpenTab("followers")}
              className="text-center cursor-pointer hover:opacity-70 transition-opacity"
            >
              <p className="text-xl font-black text-[#1A1208] leading-none">{profile.followersCount}</p>
              <p className="text-xs text-[#8C7B6E] mt-1 font-medium">Followers</p>
            </button>
            <div className="w-px h-8 bg-[#E8D9C8]" />
            <button
              onClick={() => setOpenTab("following")}
              className="text-center cursor-pointer hover:opacity-70 transition-opacity"
            >
              <p className="text-xl font-black text-[#1A1208] leading-none">{profile.followingCount}</p>
              <p className="text-xs text-[#8C7B6E] mt-1 font-medium">Following</p>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-[15px] font-black text-[#1A1208]">@{profile.username}</h1>
          {profile.bio && (
            <p className="text-sm text-[#4A3F36] mt-1 leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>

      {openTab && (
        <FollowListModal
          userId={profile.userId}
          tab={openTab}
          onClose={() => setOpenTab(null)}
        />
      )}
    </>
  );
}
