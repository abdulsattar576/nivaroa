import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/proxy";
import CheckoutForm from "@/features/orders/components/checkout-form";

export const metadata: Metadata = {
  title: "Secure Checkout | Nivaroa",
  description: "Complete your order with secure doorstep delivery across Pakistan.",
};

export default async function CheckoutPage() {
  const userSession = await getCurrentUser();

  const initialUserData = userSession?.profile
    ? {
        name: userSession.profile.full_name || undefined,
        email: userSession.user.email || undefined,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="mb-8 border-b border-[#e7eee6] pb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
            Final Step
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
            Secure Checkout
          </h1>
          <p className="mt-1 text-sm text-[#617669]">
            Enter your delivery address and receive your order with Cash on Delivery.
          </p>
        </div>

        <CheckoutForm initialUserData={initialUserData} />
      </div>
    </div>
  );
}

