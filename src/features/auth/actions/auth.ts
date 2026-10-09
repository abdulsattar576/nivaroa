"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "../schemas/auth.schema";

/**
 * Standard user & customer sign-in action
 */
export async function loginUser(data: LoginFormData) {
  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false as const,
      message: validation.error.issues[0]?.message || "Invalid email or password.",
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

  if (authError || !authData.user) {
    return {
      success: false as const,
      message: authError?.message || "Invalid email or password.",
    };
  }

  // Ensure user profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!profile) {
    const fullName =
      authData.user.user_metadata?.full_name ||
      authData.user.email?.split("@")[0] ||
      "User";
    await supabase.from("profiles").upsert({
      id: authData.user.id,
      full_name: fullName,
      role: "user",
    });
  }

  revalidatePath("/", "layout");

  return {
    success: true as const,
    role: profile?.role || "user",
    message: "Signed in successfully.",
  };
}

/**
 * Dedicated administrator sign-in action with role gate
 */
export async function adminLogin(data: LoginFormData) {
  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false as const,
      message: "Enter a valid email and a password with at least 6 characters.",
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

  if (authError || !authData.user) {
    return {
      success: false as const,
      message: "The email or password you entered is incorrect.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    return {
      success: false as const,
      message: "This account does not have administrator access.",
    };
  }

  revalidatePath("/admin", "layout");

  return {
    success: true as const,
    role: "admin" as const,
    message: "Signed in successfully.",
  };
}

/**
 * New user registration action with profile record creation
 */
export async function registerUser(data: RegisterFormData) {
  const validation = RegisterSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false as const,
      message: validation.error.issues[0]?.message || "Please check your registration details.",
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        full_name: validation.data.fullName,
      },
    },
  });

  if (authError) {
    return {
      success: false as const,
      message: authError.message,
    };
  }

  if (authData.user) {
    // Upsert the profile record
    await supabase.from("profiles").upsert({
      id: authData.user.id,
      full_name: validation.data.fullName,
      role: "user",
    });
  }

  revalidatePath("/", "layout");

  return {
    success: true as const,
    message: "Account created successfully.",
  };
}

/**
 * Password reset email request action
 */
export async function forgotPassword(data: ForgotPasswordFormData, origin: string) {
  const validation = ForgotPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false as const,
      message: validation.error.issues[0]?.message || "Please enter a valid email.",
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const redirectUrl = `${origin}/auth/callback?next=/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(
    validation.data.email,
    {
      redirectTo: redirectUrl,
    }
  );

  if (error) {
    return {
      success: false as const,
      message: error.message,
    };
  }

  return {
    success: true as const,
    message: "If an account with that email exists, we've sent password reset instructions.",
  };
}

/**
 * Update password action for authenticated user or reset token session
 */
export async function resetPassword(data: ResetPasswordFormData) {
  const validation = ResetPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false as const,
      message: validation.error.issues[0]?.message || "Please enter a valid password.",
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return {
      success: false as const,
      message: error.message,
    };
  }

  return {
    success: true as const,
    message: "Your password has been reset successfully. You can now sign in.",
  };
}

/**
 * Sign out action
 */
export async function signOutUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

