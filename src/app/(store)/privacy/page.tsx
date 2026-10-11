import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, Bell, HelpCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Nivaroa",
  description:
    "Learn how Nivaroa collects, safeguards, and respects your personal information when you browse and purchase from our store.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 12, 2026";

  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content: [
        "Personal Identifiers: When you create an account, place an order, or subscribe, we collect your full name, email address, phone number, and delivery address.",
        "Order & Transaction Records: We keep a record of the items you purchase, order status, total price, and Cash on Delivery or electronic payment confirmation.",
        "Account & Authentication Data: If you register with email/password or Google OAuth, authentication identifiers and session tokens are stored securely via Supabase.",
        "Device & Browsing Details: Information such as your IP address, browser type, and operating system are logged automatically for fraud prevention and performance optimization.",
      ],
    },
    {
      icon: FileText,
      title: "2. How We Use Your Information",
      content: [
        "Fulfilling Customer Orders: To pack, dispatch, and coordinate the delivery of your items to your chosen shipping address.",
        "Cash on Delivery & Communication: To verify your order by phone or SMS and provide shipping tracking updates.",
        "Customer Support: To respond promptly to inquiries, replacement claims, warranty questions, or order adjustments.",
        "Shopping Bag Persistence: We store your shopping bag contents locally in your browser so you do not lose your selections when reloading or returning.",
        "Platform Security & Integrity: To protect our marketplace against fraud, unauthorized account access, and policy violations.",
      ],
    },
    {
      icon: Lock,
      title: "3. Data Sharing & Third Parties",
      content: [
        "Courier & Logistics Partners: We share your delivery name, address, and phone number with authorized courier services strictly to fulfill physical delivery.",
        "Authentication & Database Infrastructure: We use Supabase with Row Level Security (RLS) to manage encrypted databases and authentication tokens.",
        "Google OAuth Services: If you choose to log in via Google, your authentication is processed securely according to Google's privacy standards.",
        "No Sale of Personal Data: We never sell, rent, or trade your personal information to third-party marketers or data brokers.",
      ],
    },
    {
      icon: Bell,
      title: "4. Cookies & Browser Storage",
      content: [
        "Essential Session Cookies: Required to keep you authenticated as you navigate between store sections and account pages.",
        "Local Storage: We utilize browser local storage to maintain your active shopping cart items without requiring an account login.",
        "You can manage or disable cookies in your browser settings at any time; however, some core shopping bag features may require local storage to function smoothly.",
      ],
    },
    {
      icon: ShieldCheck,
      title: "5. Data Retention & Your Rights",
      content: [
        "Access & Rectification: You may view and edit your profile information at any time from your Account Dashboard.",
        "Data Erasure: You have the right to request deletion of your account and personal identifiers by contacting our privacy team.",
        "Order Archival: Certain purchase and invoice records may be retained as required by tax regulations and consumer protection laws.",
      ],
    },
    {
      icon: HelpCircle,
      title: "6. Contacting Our Privacy Team",
      content: [
        "If you have questions, concerns, or requests regarding this Privacy Policy, please reach out to us:",
        "Email: privacy@nivaroa.com / Nivaroa@gmail.com",
        "Phone: +92 303 9391913",
        "Business Hours: Monday – Saturday, 9:00 AM – 7:00 PM (PKT)",
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
            <ShieldCheck className="size-3.5 text-[#24583f]" /> Legal & Transparency
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-base text-[#5c7063]">
            How Nivaroa collects, uses, and safeguards your personal data when using our marketplace.
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

        {/* Bottom Note */}
        <div className="mt-12 rounded-3xl border border-[#d7e5d5] bg-[#edf4ec] p-6 text-center sm:p-8">
          <h3 className="text-base font-bold text-[#163828]">
            Need clarification on our privacy practices?
          </h3>
          <p className="mx-auto mt-1.5 max-w-lg text-xs leading-5 text-[#4e6255]">
            Our support team is available to assist you with data requests, account deletion, and security questions.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-[#174c3a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#103d31]"
            >
              Contact Support
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center rounded-xl border border-[#c4d6c2] bg-white px-4 py-2 text-xs font-semibold text-[#1e4836] transition hover:bg-[#f5f8f4]"
            >
              Read Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

