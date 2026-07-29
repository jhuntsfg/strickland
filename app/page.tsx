"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { AGENCY } from "@/lib/agency";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(194,147,63,0.16), transparent)",
        }}
      />
      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt={AGENCY.name}
            width={140}
            height={96}
            className="object-contain"
            priority
          />
          <span className="mt-3 h-px w-10 bg-primary" />
          <span className="mt-3 text-[11px] tracking-[0.2em] text-gray-400 uppercase text-center">
            {AGENCY.name}
          </span>
        </div>
        <div className="bg-ink-light/80 backdrop-blur rounded-2xl shadow-lg border border-white/10 p-8">
          <h1 className="text-xl font-semibold text-center mb-1 text-white">Onboarding Tracker</h1>
          <p className="text-sm text-gray-400 text-center mb-6">Admin sign in</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 px-3 py-2 outline-none focus:border-primary bg-white/5 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/15 px-3 py-2 outline-none focus:border-primary bg-white/5 text-white placeholder:text-gray-500"
              />
            </div>
            {error && <p className="text-sm text-stall">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary text-ink font-semibold py-2.5 hover:bg-primary-dark hover:text-white disabled:opacity-50 transition-colors"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">{AGENCY.name} · Agent Onboarding</p>
      </div>
    </div>
  );
}
