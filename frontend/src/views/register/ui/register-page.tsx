"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@entities/user";
import { registerUser } from "@features/auth";

export function RegisterPage() {
  const router    = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const fetchMe   = useAuthStore((s) => s.fetchMe);

  const [form, setForm]       = useState({ username: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(form.username, form.email, form.password);
      setTokens(data.token.access_token, data.token.refresh_token);
      await fetchMe();
      router.replace("/feed");
    } catch (err: unknown) {
      const detail = (
        err as { response?: { data?: { detail?: string | Array<{ msg: string }> } } }
      )?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(". "));
      } else {
        setError(detail ?? "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0D0D0D] relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[#FF5500] font-black text-2xl tracking-tight">Pixora</span>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-4xl font-bold text-white leading-snug">
            Start your<br />
            <span className="text-[#FF5500]">story today.</span>
          </p>
          <p className="text-[#8C7B6E] text-lg leading-relaxed max-w-sm">
            Create an account and become part of a platform that rewards thoughtful expression.
          </p>

          <div className="space-y-3 pt-4">
            {["Share ideas with depth", "Discover quality content", "Connect with thinkers"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5500] flex items-center justify-center shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[#C4B5A5] text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border border-[#FF5500]/10" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-[#FF5500]/20" />
        <div className="absolute top-1/4 -right-8 w-40 h-40 rounded-full bg-[#FF5500]/5" />

        <div className="relative z-10 text-[#3D3226] text-sm">© 2026 Pixora. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F5EDE0]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <span className="text-[#FF5500] font-black text-2xl tracking-tight">Pixora</span>
          </div>

          <h1 className="text-3xl font-bold text-[#0D0D0D] mb-1">Create account</h1>
          <p className="text-[#8C7B6E] mb-8">
            Already have one?{" "}
            <Link href="/login" className="text-[#FF5500] font-semibold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1208] mb-1.5">Username</label>
              <input
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="yourname"
                className="w-full px-4 py-3 rounded-xl bg-[#FEF9F5] border border-[#E8D9C8] text-[#1A1208] placeholder-[#C4B5A5] outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1208] mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#FEF9F5] border border-[#E8D9C8] text-[#1A1208] placeholder-[#C4B5A5] outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1208] mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#FEF9F5] border border-[#E8D9C8] text-[#1A1208] placeholder-[#C4B5A5] outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all text-sm"
              />
              <p className="mt-1.5 text-xs text-[#8C7B6E]">Minimum 8 characters</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E64D00] active:scale-[0.98] text-white font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-xs text-center text-[#8C7B6E] pt-1">
              By signing up you agree to our Terms of Service.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
