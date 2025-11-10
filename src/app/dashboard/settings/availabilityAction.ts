"use server";

import { initBrowserClient } from "@/lib/supabase/client";

//  Get all availability data
export async function getAvailability() {
  const supabase = initBrowserClient();

  const { data, error } = await supabase
    .from("Tilgængelighed") // 👈 make sure the table name matches exactly in Supabase
    .select("id, date, is_open")
    .order("date", { ascending: true });

  if (error) {
    console.error("❌ Error fetching availability:", error);
    return [];
  }

  console.log(" Availability fetched:", data?.length || 0);
  return data;
}

// Toggle a day open/closed
export async function toggleAvailability(date: string, is_open: boolean) {
  const supabase = initBrowserClient();

  const { data, error } = await supabase
    .from("Tilgængelighed")
    .upsert([{ date, is_open }], { onConflict: "date" });

  if (error) {
    console.error("Error updating availability:", error);
  } else {
    console.log(` Updated: ${date} → ${is_open ? "ÅBEN" : "LUKKET"}`);
  }

  return data;
}
