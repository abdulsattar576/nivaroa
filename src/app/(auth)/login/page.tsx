import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, LockKeyhole, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { GuestProxy } from "@/lib/proxy";
import UserLoginForm from "@/features/auth/components/user-login-form";

export const metadata: Metadata = {
  title: "Sign In | Nivaroa",
  description: "Sign in to your Nivaroa account to track orders, save favorites, and manage your wardrobe.",
};

export default async function LoginPage() {
  await GuestProxy();

  return (
    <div className="min-h-screen bg-[#f5f7f3] p-3 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-[0_24px_90px_-36px_rgba(15,52,39,0.25)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: Brand Presentation Banner */}
        <section className="relative isolate flex min-h-80 flex-col justify-between overflow-hidden bg-[#103d31] p-7 text-white sm:p-10 lg:min-h-170 lg:p-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-24 -top-28 size-96 rounded-full border border-white/10" />
            <div className="absolute -right-10 -top-14 size-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-48 -left-32 size-120 rounded-full bg-[#2a7057]/50 blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(179,214,149,0.17),transparent_34%)]" />
          </div>

          <Link href="/" className="flex w-fit items-center gap-3" aria-label="Nivaroa home">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Sparkles className="size-5 text-[#c5df9b]" aria-hidden="true" />
            </span>
            <span className="text-xl font-semibold tracking-[0.16em]">NIVAROA</span>
          </Link>

          <div className="max-w-lg py-12 lg:py-0">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c5df9b]">
              <span className="size-1.5 rounded-full bg-[#c5df9b]" />
              Your Personal Sanctuary
            </p>
            <h1 className="max-w-md text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl">
              Thoughtfully curated for modern life.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70 sm:text-base">
              Sign in to manage your orders, access your saved items, and explore curated essentials crafted with lasting quality.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/15 pt-5 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#c5df9b]" />
              Encrypted, risk-free account access
            </span>
            <ArrowDownRight className="size-4" aria-hidden="true" />
          </div>
        </section>

        {/* Right: Login Form */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf4ec] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1e4d37]">
                <Sparkles className="size-3 text-[#1e4d37]" /> Welcome back
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#172a22]">
                Sign in to Nivaroa
              </h2>
              <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                Enter your credentials or continue with Google to access your account.
              </p>
            </div>

            <UserLoginForm />

            {/* Footer navigation */}
            <div className="mt-8 space-y-3 border-t border-[#edf2ea] pt-6 text-center text-xs text-slate-500">
              <p>
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#174c3a] underline underline-offset-2 hover:text-[#103d31]"
                >
                  Create an account
                </Link>
              </p>

              <p className="text-[11px] text-slate-400">
                Are you a team member?{" "}
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-[#174c3a]"
                >
                  <LockKeyhole className="size-3" /> Administrator Portal
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

