import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Compass, ShoppingBag, Store, HelpCircle } from "lucide-react";
import { Images } from "@/constant/Image";

export function NotFoundContent() {
  const { logo } = Images;

  const quickLinks = [
    { label: "Shop All Products", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "My Account & Orders", href: "/account" },
    { label: "Contact Customer Care", href: "/contact" },
  ];

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        {/* Brand Logo & Badge */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="grid size-20 place-items-center rounded-3xl bg-white p-3.5 shadow-md ring-1 ring-[#e4ede2]">
              <Image
                src={logo}
                alt="Nivaroa"
                width={56}
                height={56}
                className="size-12 object-contain"
                priority
              />
            </div>
            <span className="absolute -bottom-2.5 -right-2.5 grid size-8 place-items-center rounded-full bg-[#174c3a] text-white shadow-sm ring-2 ring-white">
              <Compass className="size-4 animate-spin-slow" />
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1b4d38] shadow-2xs">
          404 Error — Page Not Found
        </span>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
          We couldn&apos;t find this page
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#596d60]">
          The piece or destination you are searching for might have been moved, renamed, or is currently unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#174c3a] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#103d31]"
          >
            <ArrowLeft className="size-3.5" /> Return to Homepage
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-[#c6d7c4] bg-white px-5 py-2.5 text-xs font-bold text-[#1a4432] shadow-2xs transition hover:bg-[#f5f8f4]"
          >
            <ShoppingBag className="size-3.5" /> Explore Collection
          </Link>
        </div>

        {/* Quick Shortcuts */}
        <div className="mt-12 rounded-3xl border border-[#e4ece2] bg-white p-6 text-left shadow-2xs sm:p-7">
          <div className="flex items-center justify-between border-b border-[#f0f4ee] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#798b7e]">
              Popular Destinations
            </span>
            <Store className="size-4 text-[#8ca092]" />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center justify-between rounded-xl border border-transparent p-2.5 text-xs font-semibold text-[#284132] transition hover:border-[#d9e5d7] hover:bg-[#f6faf5]"
              >
                <span>{link.label}</span>
                <span className="text-[#96a69a]" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Line */}
        <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-[#708275]">
          <HelpCircle className="size-3.5 text-[#174c3a]" /> Need assistance? Reach our support team at{" "}
          <Link href="/contact" className="font-semibold text-[#174c3a] underline">
            contact support
          </Link>
        </p>
      </div>
    </div>
  );
}

