"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ResetPasswordSchema, type ResetPasswordFormData } from "../schemas/auth.schema";
import { resetPassword } from "../actions/auth";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError("");

    try {
      const result = await resetPassword(data);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 2000);
    } catch {
      setServerError("Unable to update password. Please check your reset link and try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
          <CheckCircle2 className="size-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#172a22]">Password reset complete</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Your password has been securely updated. You will now be redirected to the sign in page.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-[#174c3a] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#103d31]"
          >
            Sign in now <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* New Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#26372f]">
            New password
          </label>
          <span className="text-[11px] text-slate-400">At least 6 characters</span>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-[#26372f]">
          Confirm new password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438060] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Updating password...
          </>
        ) : (
          <>
            Reset password
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="text-xs font-semibold text-[#174c3a] hover:underline"
        >
          Cancel and return to sign in
        </Link>
      </div>
    </form>
  );
}

