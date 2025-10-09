"use server";

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function newMotd(msg: string) {
  const supabase = await initServerClient();
  await supabase.from("motd").insert({ msg });
  revalidatePath("/test", "page");
}

export async function deleteAll() {
    const supabase = await initServerClient();
    await supabase.from("motd").delete().neq("id", 0);
    revalidatePath("/test", "page");
}
