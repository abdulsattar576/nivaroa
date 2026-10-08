"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Minus, Plus, Sparkles, X } from "lucide-react";
import { NavbarData } from "./navbar";

const Drawer = () => {
  const [show, setShow] = useState(false);
  const [shopDrop, setShopDrop] = useState(false);

  return (
    <>
      <button type="button" aria-label={show ? "Close navigation menu" : "Open navigation menu"} aria-expanded={show} aria-controls="mobile-navigation" onClick={() => setShow((open) => !open)} className="relative z-60 grid size-10 place-items-center rounded-full text-[#304638] transition hover:bg-[#eff3ec]">
        {show ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {show && (
        <>
          <button aria-label="Close navigation overlay" onClick={() => setShow(false)} className="fixed inset-0 z-40 cursor-default bg-[#14251b]/35 backdrop-blur-[2px]" />
          <aside id="mobile-navigation" aria-label="Mobile navigation" className="fixed inset-y-0 left-0 z-50 flex w-[min(21rem,88vw)] flex-col bg-[#fbfcf8] shadow-[12px_0_48px_-20px_rgba(18,42,26,0.35)]">
            <div className="flex items-center justify-between border-b border-[#e8ece5] px-6 py-5">
              <Link href="/" onClick={() => setShow(false)} className="flex items-center gap-2.5 text-[#20382a]">
                <span className="grid size-9 place-items-center rounded-xl bg-[#eaf1e7] text-[#3b6847]"><Sparkles className="size-4" aria-hidden="true" /></span>
                <span className="text-sm font-semibold tracking-[0.14em]">NIVAROA</span>
              </Link>
              <button type="button" aria-label="Close navigation menu" onClick={() => setShow(false)} className="grid size-9 place-items-center rounded-full text-[#657269] hover:bg-[#eff2ed]"><X className="size-5" aria-hidden="true" /></button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-5" aria-label="Mobile main navigation">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#99a399]">Menu</p>
              <div className="space-y-1">
                {NavbarData.map((item) => (
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

            <div className="border-t border-[#e8ece5] p-5">
              <div className="rounded-2xl bg-[#edf3e9] p-4">
                <p className="text-sm font-semibold text-[#345640]">A little more Nivaroa</p>
                <p className="mt-1 text-xs leading-5 text-[#748576]">Thoughtfully selected pieces for everyday living.</p>
                <Link href="/shop" onClick={() => setShow(false)} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#376b47]">Discover the collection <ChevronDown className="size-3 -rotate-90" aria-hidden="true" /></Link>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Drawer;