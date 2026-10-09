"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Shield, User } from "lucide-react";
import type { AuthenticatedSession } from "@/lib/proxy";
import { signOutUser } from "@/features/auth/actions/auth";

type UserNavProps = {
  session: AuthenticatedSession | null;
};

export default function UserNav({ session }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-xl border border-[#d6e3d5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c4d37] shadow-2xs transition hover:border-[#174c3a] hover:bg-[#174c3a] hover:text-white"
      >
        <User className="size-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  const { user, profile } = session;
  const displayName = profile.full_name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isAdmin = profile.role === "admin";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className="flex items-center gap-2 rounded-xl border border-[#d8e3d6] bg-white p-1.5 transition hover:border-[#174c3a] hover:bg-[#edf3ea] focus:outline-none"
      >
        <span className="grid size-7 place-items-center rounded-lg bg-[#174c3a] text-xs font-bold text-white shadow-xs">
          {initials}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#dce6dc] bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          {/* User info header */}
          <div className="border-b border-[#edf2eb] px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-bold text-[#1b3425]">{displayName}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-amber-600/20">
                  <Shield className="size-2.5" /> Admin
                </span>
              )}
            </div>
            <p className="truncate text-[11px] text-slate-400">{user.email}</p>
          </div>

          {/* Menu links */}
          <div className="space-y-1 py-1.5 text-xs">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-[#1c4d37] hover:bg-[#edf4ec]"
              >
                <LayoutDashboard className="size-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await signOutUser();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

