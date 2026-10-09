"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, Minus, Plus, X } from "lucide-react";
import { Images } from "@/constant/Image";
import { NavbarData } from "./navbar";
import type { NavbarItem } from "./type";

import { signOutUser } from "@/features/auth/actions/auth";
import type { AuthenticatedSession } from "@/lib/proxy";
import { LayoutDashboard, LogOut, User } from "lucide-react";

type DrawerProps = {
  items?: NavbarItem[];
  session?: AuthenticatedSession | null;
};

const Drawer = ({ items, session }: DrawerProps) => {
  const [show, setShow] = useState(false);
  const [shopDrop, setShopDrop] = useState(false);
  const { logo } = Images;
  const navItems = items && items.length > 0 ? items : NavbarData;

  return (
    <>
      <button type="button" aria-label={show ? "Close navigation menu" : "Open navigation menu"} aria-expanded={show} aria-controls="mobile-navigation" onClick={() => setShow((open) => !open)} className="relative z-60 grid size-10 place-items-center rounded-xl text-[#304638] transition hover:bg-[#eff3ec]">
        {show ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {show && (
        <>
          <button aria-label="Close navigation overlay" onClick={() => setShow(false)} className="fixed inset-0 z-40 cursor-default bg-[#14251b]/35 backdrop-blur-[2px]" />
          <aside id="mobile-navigation" aria-label="Mobile navigation" className="fixed inset-y-0 left-0 z-50 flex w-[min(21rem,88vw)] flex-col bg-[#fbfcf8] shadow-[12px_0_48px_-20px_rgba(18,42,26,0.35)]">
            <div className="flex items-center justify-between border-b border-[#e8ece5] px-6 py-5">
              <Link href="/" onClick={() => setShow(false)} className="flex items-center gap-2.5 text-[#20382a]">
                <div className="grid size-9 place-items-center rounded-xl bg-[#edf3ea] p-1 ring-1 ring-[#d4e2d3]">
                  <Image src={logo} alt="Nivaroa" width={28} height={28} className="size-7 object-contain" />
                </div>
                <span className="text-sm font-semibold tracking-[0.14em]">NIVAROA</span>
              </Link>
              <button type="button" aria-label="Close navigation menu" onClick={() => setShow(false)} className="grid size-9 place-items-center rounded-full text-[#657269] hover:bg-[#eff2ed]"><X className="size-5" aria-hidden="true" /></button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-5" aria-label="Mobile main navigation">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#99a399]">Menu</p>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.type === "link" ? item.link.id : item.id}>
                    {item.type === "link" ? (
                      <Link href={item.link.href} onClick={() => setShow(false)} className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-[#405146] transition hover:bg-[#eff3ec] hover:text-[#285b3d]">
                        {item.link.name}<span aria-hidden="true" className="text-[#9ca79d]">→</span>
                      </Link>
                    ) : (
                      <>
                        <button type="button" onClick={() => setShopDrop((open) => !open)} aria-expanded={shopDrop} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium text-[#405146] transition hover:bg-[#eff3ec] hover:text-[#285b3d]">
                          {item.name}
                          {shopDrop ? <Minus className="size-4 text-[#728176]" aria-hidden="true" /> : <Plus className="size-4 text-[#728176]" aria-hidden="true" />}
                        </button>
                        {shopDrop && (
                          <div className="mb-2 ml-3 space-y-0.5 border-l border-[#dce5d9] pl-3">
                            {item.links.map((link) => (
                              <Link key={link.id} href={link.href} onClick={() => setShow(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[#758176] transition hover:bg-[#eff3ec] hover:text-[#285b3d]">{link.name}</Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Mobile Account Section */}
            <div className="border-t border-[#e8ece5] p-5">
              {session ? (
                <div className="space-y-3 rounded-2xl bg-[#edf3e9] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-[#174c3a] text-xs font-bold text-white shadow-xs">
                      {(session.profile.full_name || session.user.email || "U")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#1b3425]">
                        {session.profile.full_name || "Member"}
                      </p>
                      <p className="truncate text-[11px] text-[#697d6d]">{session.user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1 text-xs font-semibold">
                    {session.profile.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setShow(false)}
                        className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[#1c4d37] shadow-2xs hover:bg-[#e4ede0]"
                      >
                        <LayoutDashboard className="size-4" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        setShow(false);
                        await signOutUser();
                      }}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="size-4" /> Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#edf3e9] p-4">
                  <p className="text-sm font-semibold text-[#345640]">Welcome to Nivaroa</p>
                  <p className="mt-1 text-xs leading-5 text-[#748576]">Sign in to track orders and save your favorite pieces.</p>
                  <Link
                    href="/login"
                    onClick={() => setShow(false)}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#103d31]"
                  >
                    <User className="size-3.5" /> Sign in
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Drawer;