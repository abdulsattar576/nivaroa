"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[#cbe1ca] bg-[#eef6ee] p-8 text-center">
        <span className="grid size-12 mx-auto place-items-center rounded-2xl bg-[#174c3a] text-white">
          <CheckCircle2 className="size-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-[#142e20]">
          Message Sent Successfully
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#516558]">
          Thank you for reaching out. A Nivaroa representative will review your message and reply via email within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 rounded-xl border border-[#b8ceb6] bg-white px-4 py-2 text-xs font-semibold text-[#1c4936] hover:bg-[#f6faf5]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-[#20382a]">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Sarah Khan"
            className="mt-1 w-full rounded-xl border border-[#d6e0d3] bg-white px-3.5 py-2.5 text-xs text-[#192b21] shadow-2xs outline-none transition focus:border-[#174c3a] focus:ring-1 focus:ring-[#174c3a]"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#20382a]">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="sarah@example.com"
            className="mt-1 w-full rounded-xl border border-[#d6e0d3] bg-white px-3.5 py-2.5 text-xs text-[#192b21] shadow-2xs outline-none transition focus:border-[#174c3a] focus:ring-1 focus:ring-[#174c3a]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-[#20382a]">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            name="phone"
            placeholder="+92 300 1234567"
            className="mt-1 w-full rounded-xl border border-[#d6e0d3] bg-white px-3.5 py-2.5 text-xs text-[#192b21] shadow-2xs outline-none transition focus:border-[#174c3a] focus:ring-1 focus:ring-[#174c3a]"
          />
        </div>
        <div>
          <label htmlFor="orderNumber" className="block text-xs font-semibold text-[#20382a]">
            Order Reference (Optional)
          </label>
          <input
            id="orderNumber"
            name="orderNumber"
            placeholder="e.g. NVR-04291133"
            className="mt-1 w-full rounded-xl border border-[#d6e0d3] bg-white px-3.5 py-2.5 text-xs text-[#192b21] shadow-2xs outline-none transition focus:border-[#174c3a] focus:ring-1 focus:ring-[#174c3a]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-semibold text-[#20382a]">
          Subject *
        </label>
        <input
          id="subject"
          name="subject"
          required
          placeholder="What can we help you with?"
          className="mt-1 w-full rounded-xl border border-[#d6e0d3] bg-white px-3.5 py-2.5 text-xs text-[#192b21] shadow-2xs outline-none transition focus:border-[#174c3a] focus:ring-1 focus:ring-[#174c3a]"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-[#20382a]">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Write your inquiry or question here..."
          className="mt-1 w-full rounded-xl border border-[#d6e0d3] bg-white px-3.5 py-2.5 text-xs text-[#192b21] shadow-2xs outline-none transition focus:border-[#174c3a] focus:ring-1 focus:ring-[#174c3a]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#174c3a] py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#103d31] disabled:opacity-70"
      >
        {loading ? (
          "Sending message..."
        ) : (
          <>
            Send Inquiry <Send className="size-3.5" />
          </>
        )}
      </button>
    </form>
  );
}

