import { Metadata } from "next";
import Link from "next/link";
import { Truck, ShieldCheck, HeartHandshake, Gift, ArrowRight, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Commitments | Nivaroa",
  description:
    "Explore our dedicated e-commerce services: express dispatch, cash on delivery, and corporate gifting.",
};

export default function ServicesPage() {
  const services = [
    {
      icon: Truck,
      title: "Nationwide Express Delivery",
      desc: "Fast, reliable dispatch across all regions with careful parcel protection and doorstep Cash on Delivery.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Authenticity",
      desc: "Every product is checked and verified before listing, ensuring genuine quality and honest specifications.",
    },
    {
      icon: HeartHandshake,
      title: "Hassle-Free 7-Day Exchange",
      desc: "Easy replacement service for any damaged or defective items to guarantee peace of mind with every purchase.",
    },
    {
      icon: Gift,
      title: "Curated & Corporate Gifting",
      desc: "Custom gift packaging, personalized notes, and corporate orders tailored for special occasions and team appreciation.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174c3a] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to Store
          </Link>
        </div>

        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
            Excellence & Care
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#142e20] sm:text-5xl">
            Our Services & Commitments
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#596d60]">
            Everything we do is designed to give you a smooth, enjoyable, and dependable shopping experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mb-14">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-3xl border border-[#e4ece2] bg-white p-8 shadow-xs"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#142e20]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#586b5f]">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-[#cde0cb] bg-[#174c3a] p-8 text-center text-white sm:p-12 shadow-sm">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to experience Nivaroa?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
            Browse through our latest curated collections and enjoy doorstep delivery today.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#174c3a] transition hover:bg-[#edf5eb]"
            >
              Explore Shop <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

