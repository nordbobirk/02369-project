"use server";

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setSetting(setting_key: string, setting_value: string) {
  const supabase = await initServerClient();
  await supabase.from("settings").insert({ setting_key, setting_value });
  revalidatePath("/settings", "page");
}

export async function deleteAll() {
    const supabase = await initServerClient();
    await supabase.from("settings").delete().neq("id", 0);
    revalidatePath("/settings", "page");
}
