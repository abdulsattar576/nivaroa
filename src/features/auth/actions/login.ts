"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { LoginSchema, type LoginFormData } from "../schemas/Login.schema";

export async function AdminLogin(data: LoginFormData) {
    const validatedData = LoginSchema.safeParse(data);

    if (!validatedData.success) {
        return {
            success: false,
            message: "Enter a valid email and a password with at least 6 characters.",
        };
    }

    const supabase = createClient(await cookies());
    const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword(validatedData.data);

    if (authError || !authData.user) {
        return {
            success: false,
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
            success: false,
            message: "This account does not have administrator access.",
        };
    }

    return { success: true, message: "Signed in successfully." };
}