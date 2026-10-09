"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LoaderCircle, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterSchema, type RegisterFormData } from "../schemas/auth.schema";
import { registerUser } from "../actions/auth";
import GoogleOAuthButton from "./google-oauth-button";

export default function UserRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const result = await registerUser(data);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setSuccessMessage("Your account has been created successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1500);
    } catch {
      setServerError("Unable to complete registration. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Google OAuth Quick Sign-up */}
      <GoogleOAuthButton next="/" label="Sign up with Google" />

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-[#e2eae1]" />
        <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400">
          Or register with email
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-[#26372f]">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Alex Johnson"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "name-error" : undefined}
              {...register("fullName")}
              className="h-12 w-full rounded-xl border border-[#dce5de] bg-white pl-11 pr-4 text-sm text-[#172a22] outline-none transition placeholder:text-slate-400 hover:border-[#b8c9bb] focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-400/10"
            />
          </div>
          {errors.fullName && (
            <p id="name-error" className="text-xs text-rose-600" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#26372f]">
              Password
            </label>
            <span className="text-[11px] text-slate-400">At least 6 characters</span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              className="h-12 w-full rounded-xl border border-[#dce5de] bg-white pl-11 pr-12 text-sm text-[#172a22] outline-none transition placeholder:text-slate-400 hover:border-[#b8c9bb] focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-400/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-xs text-rose-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-[#26372f]">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
              {...register("confirmPassword")}
              className="h-12 w-full rounded-xl border border-[#dce5de] bg-white pl-11 pr-4 text-sm text-[#172a22] outline-none transition placeholder:text-slate-400 hover:border-[#b8c9bb] focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-400/10"
            />
          </div>
          {errors.confirmPassword && (
            <p id="confirm-error" className="text-xs text-rose-600" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700" role="alert">
            {serverError}
          </p>
        )}

        {successMessage && (
          <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800" role="status">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            {successMessage}
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
              Creating account...
            </>
          ) : (
            <>
              Create your account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-500">
          By registering, you agree to Nivaroa&apos;s{" "}
          <Link href="/terms" className="underline hover:text-[#174c3a]">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-[#174c3a]">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}

