import type { UserProfile } from "@/entities/user/model/types";

interface Props {
  profile: UserProfile;
}

export default function ProfileHero({ profile }: Props) {
  return (
    <div className="mb-4">
      {/* Avatar + stats row */}
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
          <div className="text-center">
            <p className="text-xl font-black text-[#1A1208] leading-none">{profile.followersCount}</p>
            <p className="text-xs text-[#8C7B6E] mt-1 font-medium">Followers</p>
          </div>
          <div className="w-px h-8 bg-[#E8D9C8]" />
          <div className="text-center">
            <p className="text-xl font-black text-[#1A1208] leading-none">{profile.followingCount}</p>
            <p className="text-xs text-[#8C7B6E] mt-1 font-medium">Following</p>
          </div>
        </div>
      </div>

      {/* Username + bio */}
      <div>
        <h1 className="text-[15px] font-black text-[#1A1208]">@{profile.username}</h1>
        {profile.bio && (
          <p className="text-sm text-[#4A3F36] mt-1 leading-relaxed">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}
