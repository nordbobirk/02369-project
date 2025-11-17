"use server";

import { redirect } from "next/navigation";
import { initServerClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await initServerClient();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return "Ugyldig email eller password";
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!data.user || error) {
    return "Ugyldig email eller password";
  }

  redirect("/dashboard");
}
