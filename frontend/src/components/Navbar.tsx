"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  username?: string;
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExploreIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Navbar({ username }: Props) {
  const pathname = usePathname();
  const isFeed     = pathname === "/feed";
  const isDiscover = pathname === "/discover";
  const isProfile  = username ? pathname === `/${username}` : false;

  return (
    <>
      {/* ── Desktop Left Sidebar (lg+) ─────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col z-30 bg-[#FDF8F3] border-r border-[#E8D9C8]">
        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <Link href="/feed" className="block">
            <span className="text-[22px] font-black tracking-tight text-[#1A1208]">
              <span className="text-[#FF5500]">Pixora</span>
            </span>
          </Link>
          <p className="text-[11px] text-[#C4B5A5] font-medium mt-0.5 tracking-wide">Share your moments</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-3">
          <Link
            href="/feed"
            className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-150 font-medium text-[15px] ${
              isFeed
                ? "bg-[#FF5500]/10 text-[#FF5500]"
                : "text-[#8C7B6E] hover:bg-[#EDE3D8] hover:text-[#1A1208]"
            }`}
            aria-current={isFeed ? "page" : undefined}
          >
            <HomeIcon active={isFeed} />
            <span>Home</span>
            {isFeed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF5500]" />}
          </Link>

          <Link
            href="/discover"
            className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-150 font-medium text-[15px] ${
              isDiscover
                ? "bg-[#FF5500]/10 text-[#FF5500]"
                : "text-[#8C7B6E] hover:bg-[#EDE3D8] hover:text-[#1A1208]"
            }`}
            aria-current={isDiscover ? "page" : undefined}
          >
            <ExploreIcon active={isDiscover} />
            <span>Explore</span>
            {isDiscover && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF5500]" />}
          </Link>

          <Link
            href={username ? `/${username}` : "/feed"}
            className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-150 font-medium text-[15px] ${
              isProfile
                ? "bg-[#FF5500]/10 text-[#FF5500]"
                : "text-[#8C7B6E] hover:bg-[#EDE3D8] hover:text-[#1A1208]"
            }`}
            aria-current={isProfile ? "page" : undefined}
          >
            <ProfileIcon active={isProfile} />
            <span>Profile</span>
            {isProfile && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF5500]" />}
          </Link>
        </nav>

        {/* Create post CTA */}
        <div className="px-3 pb-6 pt-3">
          <Link
            href="/create"
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#FF5500] text-white font-semibold text-[15px] hover:bg-[#e64d00] active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#FF5500]/25"
            aria-label="Create new post"
          >
            <PlusIcon />
            <span>Create post</span>
          </Link>

          {/* Username chip */}
          {username && (
            <Link
              href={`/${username}`}
              className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#EDE3D8] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5500] to-[#FF8C42] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {username[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1A1208] truncate leading-none">@{username}</p>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* ── Mobile Bottom Nav (<lg) ────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FDF8F3]/90 backdrop-blur-md border-t border-[#E8D9C8]"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center h-16 px-4 max-w-lg mx-auto">
          {/* Home */}
          <Link
            href="/feed"
            className={`flex-1 flex flex-col items-center gap-1 transition-colors ${
              isFeed ? "text-[#FF5500]" : "text-[#C4B5A5] hover:text-[#8C7B6E]"
            }`}
            aria-label="Home feed"
            aria-current={isFeed ? "page" : undefined}
          >
            <HomeIcon active={isFeed} />
            <span className="text-[10px] font-semibold tracking-wide">Home</span>
          </Link>

          {/* Explore */}
          <Link
            href="/discover"
            className={`flex-1 flex flex-col items-center gap-1 transition-colors ${
              isDiscover ? "text-[#FF5500]" : "text-[#C4B5A5] hover:text-[#8C7B6E]"
            }`}
            aria-label="Discover"
            aria-current={isDiscover ? "page" : undefined}
          >
            <ExploreIcon active={isDiscover} />
            <span className="text-[10px] font-semibold tracking-wide">Explore</span>
          </Link>

          {/* Create */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/create"
              className="w-11 h-11 rounded-2xl bg-[#FF5500] text-white flex items-center justify-center shadow-md shadow-[#FF5500]/30 hover:bg-[#e64d00] active:scale-95 transition-all"
              aria-label="Create new post"
            >
              <PlusIcon />
            </Link>
          </div>

          {/* Profile */}
          <Link
            href={username ? `/${username}` : "/feed"}
            className={`flex-1 flex flex-col items-center gap-1 transition-colors ${
              isProfile ? "text-[#FF5500]" : "text-[#C4B5A5] hover:text-[#8C7B6E]"
            }`}
            aria-label="My profile"
            aria-current={isProfile ? "page" : undefined}
          >
            <ProfileIcon active={isProfile} />
            <span className="text-[10px] font-semibold tracking-wide">Profile</span>
          </Link>
        </div>

        <div className="h-safe-area-inset-bottom" />
      </nav>
    </>
  );
}
