"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type GoogleOAuthButtonProps = {
  next?: string;
  label?: string;
};

export default function GoogleOAuthButton({
  next = "/",
  label = "Continue with Google",
}: GoogleOAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        next
      )}`;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (signInError) {
        const msg = signInError.message || "";
        if (
          msg.toLowerCase().includes("provider is not enabled") ||
          msg.toLowerCase().includes("unsupported provider")
        ) {
          setError(
            "Google sign-in is not enabled in your Supabase project yet. Please enable the Google provider in your Supabase Dashboard (Authentication > Providers > Google)."
          );
        } else {
          setError(msg);
        }
        setLoading(false);
      }
    } catch {
      setError("Unable to initialize Google sign-in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex h-[3.25rem] w-full items-center justify-center gap-3 rounded-xl border border-[#dce5de] bg-white px-4 text-sm font-semibold text-[#1f3729] shadow-xs transition hover:bg-[#f6f9f5] hover:border-[#b8c9bb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438060] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle className="size-4.5 animate-spin text-[#174c3a]" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <svg
              className="size-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-center text-xs text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

