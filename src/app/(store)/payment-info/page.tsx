import { Metadata } from "next";
import Link from "next/link";
import { Banknote, ShieldCheck, Truck, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Information | Nivaroa",
  description:
    "Learn about Cash on Delivery (COD), order verification, and safe payment methods at Nivaroa.",
};

export default function PaymentInfoPage() {
  const steps = [
    {
      step: "01",
      title: "Place Your Order",
      desc: "Select Cash on Delivery during checkout. No advance card information required.",
    },
    {
      step: "02",
      title: "Order Verification",
      desc: "Our dispatch department confirms your shipping address and contact number prior to packaging.",
    },
    {
      step: "03",
      title: "Doorstep Handover",
      desc: "Our courier delivers the parcel directly to your address. Hand over the exact cash amount upon receipt.",
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
            <Banknote className="size-3.5 text-[#24583f]" /> Payment & Billing
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
            Payment Information
          </h1>
          <p className="mt-2 text-base text-[#5c7063]">
            Simple, secure, and hassle-free payment options tailored for our customers.
          </p>
        </div>

        <div className="space-y-8">
          {/* Main COD Card */}
          <div className="rounded-3xl border border-[#e4ebe2] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#f0f4ef] pb-4">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                <Banknote className="size-5" />
              </span>
              <h2 className="text-xl font-bold text-[#142e20]">
                Cash on Delivery (COD)
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#516558]">
              Cash on Delivery is available nationwide across all major cities and regional areas. Pay with cash only when your order is safely delivered to your doorstep.
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

          {/* Shipping & Delivery Fees */}
          <div className="rounded-3xl border border-[#e4ebe2] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#f0f4ef] pb-4">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                <Truck className="size-5" />
              </span>
              <h2 className="text-xl font-bold text-[#142e20]">
                Shipping & Handling Rates
              </h2>
            </div>
            <div className="mt-5 space-y-3 text-sm text-[#516558]">
              <p>
                <strong>Free Standard Shipping:</strong> Every order with a subtotal of <strong>$100 or more</strong> qualifies for 100% free delivery nationwide.
              </p>
              <p>
                <strong>Standard Flat Rate:</strong> Orders under $100 are charged a standard flat shipping fee of <strong>$10.00</strong> to cover courier logistics and protective packaging.
              </p>
              <p>
                <strong>Estimated Delivery Timeline:</strong> 2 to 4 business days for major metropolitan hubs; 3 to 6 business days for regional addresses.
              </p>
            </div>
          </div>

          {/* Electronic Payments Note */}
          <div className="rounded-3xl border border-[#e4ebe2] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#f0f4ef] pb-4">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                <ShieldCheck className="size-5" />
              </span>
              <h2 className="text-xl font-bold text-[#142e20]">
                Future Payment Methods
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#516558]">
              We are actively integrating Easypaisa, JazzCash, and direct debit card processing. These options will be unlocked in checkout as soon as gateway approvals finalize.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-xl bg-[#174c3a] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#103d31]"
          >
            Start Shopping Now
          </Link>
        </div>
      </div>
    </div>
  );
}

