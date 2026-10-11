import { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Nivaroa Support",
  description:
    "Get in touch with the Nivaroa customer care team. Inquiries regarding orders, shipping, and product support.",
};

export default function ContactPage() {
  const contactDetails = [
    {
      icon: Phone,
      title: "Call / WhatsApp",
      detail: "+92 303 9391913",
      subtext: "Mon – Sat from 9:00 AM to 7:00 PM",
    },
    {
      icon: Mail,
      title: "Email Support",
      detail: "Nivaroa@gmail.com",
      subtext: "We respond to all tickets within 24 hours",
    },
    {
      icon: MapPin,
      title: "Headquarters",
      detail: "Islamabad, Pakistan",
      subtext: "Nationwide dispatch & delivery center",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      detail: "9:00 AM – 7:00 PM PKT",
      subtext: "Online store open 24/7",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174c3a] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to Store
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
            <MessageSquare className="size-3.5 text-[#24583f]" /> We are here to help
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
            Get in touch with Nivaroa
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#5d7164]">
            Have a question about an order, delivery time, or need assistance choosing a product? Reach out and our team will assist you.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          {/* Contact Details Cards */}
          <div className="space-y-4">
            {contactDetails.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-3xl border border-[#e4ece2] bg-white p-5 shadow-xs transition hover:border-[#174c3a]/30"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#edf4ec] text-[#1b4e38]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#798a7e]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-base font-bold text-[#142e20]">
                      {item.detail}
                    </p>
                    <p className="mt-0.5 text-xs text-[#5f7366]">
                      {item.subtext}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="rounded-3xl border border-[#d6e4d4] bg-[#edf4ec] p-6 text-center">
              <h4 className="text-sm font-bold text-[#163828]">
                Looking to track an existing order?
              </h4>
              <p className="mt-1 text-xs text-[#506456]">
                Review all past shipments and real-time delivery status from your account.
              </p>
              <Link
                href="/account/orders"
                className="mt-4 inline-flex items-center rounded-xl bg-[#174c3a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#103d31]"
              >
                Track My Orders
              </Link>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#e4ece2] bg-white p-6 shadow-xs sm:p-8">
            <h2 className="text-xl font-bold text-[#142e20]">
              Send Us a Message
            </h2>
            <p className="mt-1 text-xs text-[#63776a]">
              Fill out the form below and we will get back to you promptly.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

