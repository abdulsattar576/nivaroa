import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type AuthenticatedSession = {
  user: NonNullable<Awaited<ReturnType<ReturnType<typeof createClient>["auth"]["getUser"]>>["data"]["user"]>;
  profile: {
    id: string;
    full_name: string | null;
    role: "user" | "admin";
  };
};

/**
 * Validates that the active session belongs to an administrator.
 * If not authenticated, redirects to /admin/login.
 * If authenticated but non-admin, redirects to store homepage (/).
 */
export const AdminProxy = async (): Promise<AuthenticatedSession> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || profile?.role !== "admin") {
    redirect("/");
  }

  return { user, profile };
};

/**
 * Validates that the active session is authenticated (any role).
 * If not authenticated, redirects to /login (with returnTo query param if specified).
 */
export const UserProxy = async (returnTo?: string): Promise<AuthenticatedSession> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const destination = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";
    redirect(destination);
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // Self-heal profile record if absent
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    const { data: newProfile } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        role: "user",
      })
      .select("id, full_name, role")
      .single();

    profile = newProfile || { id: user.id, full_name: fullName, role: "user" };
  }

  return { user, profile };
};

/**
 * Ensures the visitor is a guest (not authenticated).
 * If already logged in, redirects admins to /admin and customers to /.
 * Useful for /login, /register, and /forgot-password pages.
 */
export const GuestProxy = async (redirectTo = "/") => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      redirect("/admin");
    }

    redirect(redirectTo);
  }
};

/**
 * Safe helper to retrieve current user and profile without redirecting.
 * Ideal for headers, navigation bars, and conditional UI components.
 */
export const getCurrentUser = async (): Promise<AuthenticatedSession | null> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    const fullName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    return {
      user,
      profile: profile || {
        id: user.id,
        full_name: fullName,
        role: "user",
      },
    };
  } catch {
    return null;
  }
};