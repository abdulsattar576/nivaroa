"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/auth.schema";
import { forgotPassword } from "../actions/auth";

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError("");

    try {
      const origin = window.location.origin;
      const result = await forgotPassword(data, origin);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch {
      setServerError("Unable to send reset instructions. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
          <CheckCircle2 className="size-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#172a22]">Instructions sent</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            We&apos;ve sent password reset instructions to{" "}
            <span className="font-semibold text-[#174c3a]">{submittedEmail}</span>.
            Please check your inbox and follow the link provided.
          </p>
        </div>

        <div className="rounded-xl border border-[#dce5de] bg-[#fbfcfb] p-4 text-xs text-slate-500">
          Didn&apos;t receive the email? Check your spam folder or wait a couple of minutes before trying again.
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#174c3a] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#26372f]">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className="h-12 w-full rounded-xl border border-[#dce5de] bg-white pl-11 pr-4 text-sm text-[#172a22] outline-none transition placeholder:text-slate-400 hover:border-[#b8c9bb] focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-400/10"
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-xs text-rose-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700" role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438060] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Sending instructions...
          </>
        ) : (
          <>
            Send reset instructions
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174c3a] hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Back to sign in
        </Link>
      </div>
    </form>
  );
}

