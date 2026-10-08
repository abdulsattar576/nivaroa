"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  LoginSchema,
  type LoginFormData,
} from "../schemas/Login.schema";
import { AdminLogin } from "../actions/login";

const AdminLoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      const result = await AdminLogin(data);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setServerError("We could not sign you in. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-[#26372f]">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@yourstore.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className="h-[3.25rem] w-full rounded-xl border border-[#dce5de] bg-white pl-11 pr-4 text-sm text-[#172a22] outline-none transition placeholder:text-slate-400 hover:border-[#b8c9bb] focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-400/10"
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-xs text-rose-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="block text-sm font-medium text-[#26372f]">
            Password
          </label>
          <span className="text-xs text-slate-400">At least 6 characters</span>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            className="h-[3.25rem] w-full rounded-xl border border-[#dce5de] bg-white px-4 pr-12 text-sm text-[#172a22] outline-none transition placeholder:text-slate-400 hover:border-[#b8c9bb] focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-400/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="size-[18px]" aria-hidden="true" />
            ) : (
              <Eye className="size-[18px]" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-xs text-rose-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700" role="alert">
          {serverError}
        </p>
      )}

      <button
        className="group flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_-10px_rgba(23,76,58,0.8)] transition hover:bg-[#103d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438060] disabled:cursor-not-allowed disabled:opacity-65"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          <>
            Sign in to dashboard
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
};

export default AdminLoginForm;