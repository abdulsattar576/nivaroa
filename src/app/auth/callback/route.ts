import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Determine correct origin (handle Vercel / reverse proxy headers)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const isLocalEnv = process.env.NODE_ENV === "development";
  const origin = !isLocalEnv && forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin;

  if (errorParam || errorDescription) {
    const errorMsg = encodeURIComponent(
      errorDescription || errorParam || "Authentication with Google failed."
    );
    return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, origin));
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure profile exists for the user (Google OAuth sign-in / signup)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        const fullName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "User";

        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          role: "user",
        });
      }

      // If user is admin and default redirect is root, route them to admin
      if (existingProfile?.role === "admin" && next === "/") {
        return NextResponse.redirect(new URL("/admin", origin));
      }
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}

