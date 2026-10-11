import { Metadata } from "next";
import Link from "next/link";
import { Leaf, Sparkles, Shield, HeartHandshake, ArrowRight, Store, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Nivaroa",
  description:
    "Discover the story of Nivaroa — curated essentials, timeless craft, and considered items made for everyday luxury.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: "Considered Living",
      desc: "Every product in our collection is chosen with intention. We prioritize items that combine functional excellence with timeless aesthetic appeal.",
    },
    {
      icon: Shield,
      title: "Uncompromising Quality",
      desc: "We rigorously evaluate manufacturing materials, durability, and finishing before introducing any piece to our catalog.",
    },
    {
      icon: PackageCheck,
      title: "Reliable Nationwide Delivery",
      desc: "With seamless Cash on Delivery and express shipping, we ensure your purchases arrive safely and right on time.",
    },
    {
      icon: HeartHandshake,
      title: "Customer-Centric Care",
      desc: "From checkout to unboxing, our dedicated team is here to assist with 7-day hassle-free replacements and personal support.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {/* Hero Banner */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
            <Leaf className="size-3.5 text-[#24583f]" /> Our Story & Purpose
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#142e20] sm:text-5xl">
            Good things for the everyday.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#596d60] sm:text-lg">
            Nivaroa was founded on a simple principle: life is better when the things you touch, wear, and use every day are crafted with care and built to endure.
          </p>
        </div>

        {/* Brand Narrative Card */}
        <div className="mb-16 overflow-hidden rounded-3xl border border-[#e2ebe0] bg-white p-8 shadow-xs sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2f6248]">
                The Nivaroa Standard
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#142e20] sm:text-3xl">
                Elevating your daily routine through considered design.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#526659]">
                In a world of fast trends and disposable goods, Nivaroa curates pieces that feel at home in your space. Whether it is modern tech essentials, apparel, or curated home lifestyle products, every selection is evaluated for real-world reliability and timeless design.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#526659]">
                We partner with responsible creators and established manufacturers to bring you curated finds at honest, transparent prices.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e1e9df] bg-[#f4f7f2] p-8 text-center sm:p-10">
              <span className="grid size-16 mx-auto place-items-center rounded-2xl bg-[#174c3a] text-white shadow-md">
                <Sparkles className="size-8" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-[#142e20]">
                Curated With Intention
              </h3>
              <p className="mt-2 text-xs leading-6 text-[#5e7164]">
                Over 1,000+ satisfied customers nationwide enjoy our verified items, cash on delivery convenience, and dedicated support.
              </p>
              <div className="mt-6 flex justify-center gap-4 border-t border-[#e3ebdf] pt-6">
                <div>
                  <p className="text-2xl font-extrabold text-[#174c3a]">100%</p>
                  <p className="text-[11px] font-medium text-[#738478]">Authentic</p>
                </div>
                <div className="h-10 w-px bg-[#d9e3d6]" />
                <div>
                  <p className="text-2xl font-extrabold text-[#174c3a]">7-Day</p>
                  <p className="text-[11px] font-medium text-[#738478]">Replacement</p>
                </div>
                <div className="h-10 w-px bg-[#d9e3d6]" />
                <div>
                  <p className="text-2xl font-extrabold text-[#174c3a]">COD</p>
                  <p className="text-[11px] font-medium text-[#738478]">Nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#142e20] sm:text-3xl">
              What We Stand For
            </h2>
            <p className="mt-1 text-sm text-[#617467]">
              The core pillars that guide our curation and customer relationships.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="rounded-3xl border border-[#e4ece2] bg-white p-7 shadow-xs transition hover:border-[#174c3a]/30"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-[#142e20]">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#586b5f]">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl border border-[#cde0cb] bg-[#174c3a] p-8 text-center text-white sm:p-12 shadow-sm">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Explore the Nivaroa Collection
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
            Discover our curated lineup of timeless electronics, fashion, and lifestyle essentials.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#174c3a] transition hover:bg-[#edf5eb]"
            >
              Shop All Products <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl border border-white/25 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

