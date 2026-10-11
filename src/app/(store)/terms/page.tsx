import { Metadata } from "next";
import Link from "next/link";
import { Scale, FileCheck, Truck, RefreshCw, AlertCircle, HelpCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Nivaroa",
  description:
    "Review the terms, sales conditions, delivery protocols, and return policies governing your purchases at Nivaroa.",
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "October 12, 2026";

  const sections = [
    {
      icon: Scale,
      title: "1. Acceptance of Terms",
      content: [
        "By accessing our website, browsing our catalog, or completing an order on Nivaroa, you agree to be bound by these Terms and Conditions.",
        "If you do not agree with any part of these terms, please discontinue using our storefront and services immediately.",
        "We reserve the right to revise or update these Terms at any time. Continued use of our site following updates constitutes acceptance of the amended terms.",
      ],
    },
    {
      icon: FileCheck,
      title: "2. Products, Pricing & Availability",
      content: [
        "Product Specifications: We strive to display product photography, technical specifications, and descriptions as accurately as possible. Slight variations in color tones may occur due to monitor calibration.",
        "Pricing Integrity: All prices shown on product pages and checkout are in US Dollars ($ / USD) or local equivalents, inclusive of applicable taxes unless specified otherwise.",
        "Inventory Limits: Products are offered subject to real-time inventory availability. If an ordered item becomes out of stock after order submission, our customer care team will notify you immediately with replacement or cancellation options.",
      ],
    },
    {
      icon: Truck,
      title: "3. Orders & Cash on Delivery (COD)",
      content: [
        "Order Placement: Placing an order constitutes an offer to purchase. An automated order receipt is generated, followed by internal verification.",
        "Cash on Delivery: For COD orders, you agree to inspect the external shipping package and provide the exact cash payment to the delivery rider upon handover.",
        "Address Accuracy: It is the buyer's responsibility to provide complete and accurate delivery addresses, postal codes, and an active phone number for courier coordination.",
        "Free Shipping Threshold: Orders meeting or exceeding $100 qualify for free standard shipping. Orders below $100 are subject to a flat $10 shipping fee.",
      ],
    },
    {
      icon: RefreshCw,
      title: "4. Returns, Replacements & Warranty",
      content: [
        "7-Day Replacement Window: You may request a replacement within 7 days of delivery if your item arrives damaged, defective, or incorrect.",
        "Return Condition: Returned merchandise must be in original condition, with tags, accessories, and authentic packaging intact.",
        "Manufacturer Warranty: Products with designated manufacturer warranties are serviced according to the respective brand's warranty criteria.",
      ],
    },
    {
      icon: AlertCircle,
      title: "5. User Conduct & Account Security",
      content: [
        "Account Confidentiality: If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.",
        "Prohibited Activities: You agree not to manipulate prices, inject malicious code, attempt unauthorized database access, or engage in fraudulent order submissions.",
        "Account Suspension: Nivaroa reserves the right to suspend or terminate accounts that violate platform policies or repeatedly reject confirmed Cash on Delivery orders without valid cause.",
      ],
    },
    {
      icon: HelpCircle,
      title: "6. Customer Assistance & Inquiries",
      content: [
        "For questions regarding our terms, shipping inquiries, or returns, please contact our team:",
        "Email: support@nivaroa.com / Nivaroa@gmail.com",
        "Helpline: +92 303 9391913",
        "Physical Address: Nivaroa E-Commerce Operations, Islamabad, Pakistan",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174c3a] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to Store
          </Link>
        </div>

        {/* Hero Header */}
        <div className="mb-12 border-b border-[#e7efe7] pb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
            <Scale className="size-3.5 text-[#24583f]" /> Terms of Service
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-base text-[#5c7063]">
            The rules, guidelines, and agreements governing your purchases and interactions with Nivaroa.
          </p>
          <p className="mt-3 text-xs font-medium text-[#7a8b80]">
            Last Updated: <span className="text-[#203a2c] font-semibold">{lastUpdated}</span>
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="rounded-3xl border border-[#e4ebe2] bg-white p-6 shadow-xs sm:p-8"
              >
                <div className="flex items-center gap-3 border-b border-[#f0f4ef] pb-4">
                  <span className="grid size-10 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-lg font-bold text-[#142e20] sm:text-xl">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-5 space-y-3">
                  {section.content.map((paragraph, idx) => (
                    <p key={idx} className="text-sm leading-relaxed text-[#4f6356]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 rounded-3xl border border-[#d7e5d5] bg-[#edf4ec] p-6 text-center sm:p-8">
          <h3 className="text-base font-bold text-[#163828]">
            Questions about our Terms?
          </h3>
          <p className="mx-auto mt-1.5 max-w-lg text-xs leading-5 text-[#4e6255]">
            Our legal and customer support representatives are happy to clarify any policies before you complete your purchase.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-[#174c3a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#103d31]"
            >
              Contact Support
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center rounded-xl border border-[#c4d6c2] bg-white px-4 py-2 text-xs font-semibold text-[#1e4836] transition hover:bg-[#f5f8f4]"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

