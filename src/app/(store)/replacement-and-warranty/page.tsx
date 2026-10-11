import { Metadata } from "next";
import Link from "next/link";
import { RefreshCcw, ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Replacement & Warranty | Nivaroa",
  description:
    "Learn about our 7-day replacement guarantee, return guidelines, and official warranty policies.",
};

export default function ReplacementAndWarrantyPage() {
  const steps = [
    {
      step: "Step 1",
      title: "Contact Support Within 7 Days",
      desc: "Reach out to us via email or WhatsApp (+92 303 9391913) with your order number and brief photos or video of the issue.",
    },
    {
      step: "Step 2",
      title: "Inspection & Pickup",
      desc: "Our courier will coordinate a return pickup or exchange handover from your shipping location.",
    },
    {
      step: "Step 3",
      title: "Instant Replacement Dispatched",
      desc: "Once received and verified, a fresh replacement item is immediately dispatched to your doorstep at no additional charge.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174c3a] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to Store
          </Link>
        </div>

        <div className="mb-12 border-b border-[#e7efe7] pb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
            <RefreshCcw className="size-3.5 text-[#24583f]" /> Peace of Mind Guarantee
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
            Replacement & Warranty Policy
          </h1>
          <p className="mt-2 text-base text-[#5c7063]">
            Every item purchased from Nivaroa is protected by our transparent customer satisfaction guarantee.
          </p>
        </div>

        <div className="space-y-8">
          {/* 7-Day Guarantee */}
          <div className="rounded-3xl border border-[#e4ebe2] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#f0f4ef] pb-4">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                <ShieldCheck className="size-5" />
              </span>
              <h2 className="text-xl font-bold text-[#142e20]">
                7-Day Replacement Guarantee
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#516558]">
              If you receive an item that is defective, physically damaged upon arrival, or incorrect, you are eligible for an immediate replacement within 7 calendar days of delivery.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {steps.map((s) => (
                <div key={s.step} className="rounded-2xl border border-[#e8ece5] bg-[#f9faf8] p-5">
                  <span className="text-xs font-extrabold text-[#174c3a]">{s.step}</span>
                  <h3 className="mt-2 text-sm font-bold text-[#142e20]">{s.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#627568]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty Terms */}
          <div className="rounded-3xl border border-[#e4ebe2] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#f0f4ef] pb-4">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                <CheckCircle2 className="size-5" />
              </span>
              <h2 className="text-xl font-bold text-[#142e20]">
                Warranty Coverage Details
              </h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-[#516558]">
              <li className="flex items-start gap-2.5">
                <span className="size-1.5 rounded-full bg-[#174c3a] mt-2 shrink-0" />
                <span><strong>Official Manufacturer Warranty:</strong> Eligible consumer electronics carry brand manufacturer warranties (e.g., 6 months to 1 year) as indicated on the product specifications.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="size-1.5 rounded-full bg-[#174c3a] mt-2 shrink-0" />
                <span><strong>Coverage Inclusions:</strong> Internal component defects, hardware malfunctions under normal usage, and factory manufacturing issues.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="size-1.5 rounded-full bg-[#174c3a] mt-2 shrink-0" />
                <span><strong>Coverage Exclusions:</strong> Accidental drops, liquid immersion, unauthorized repairs, and physical abuse.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-[#d6e4d4] bg-[#edf4ec] p-6 text-center sm:p-8">
          <h3 className="text-base font-bold text-[#163828]">
            Need to request a replacement?
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-[#506456]">
            Contact our helpline or email us with your order reference number to initiate your claim immediately.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-[#174c3a] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#103d31]"
            >
              Contact Warranty Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

