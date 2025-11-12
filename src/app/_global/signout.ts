"use server";

import { initServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signout() {
    const supabase = await initServerClient();
    await supabase.auth.signOut();
    redirect("/");
}