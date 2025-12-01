"use client";

import { initBrowserClient } from "@/lib/supabase/client";

export async function getAvailability() {
  const supabase = initBrowserClient();

  const { data, error } = await supabase
    .from("Tilgængelighed")
    .select("date, is_open");

  if (error) throw error;

  return data;
}

export async function toggleAvailability(date: string, newValue: boolean) {
  const supabase = initBrowserClient();

  const { error } = await supabase
    .from("Tilgængelighed")
    .update({ is_open: newValue })
    .eq("date", date);

  if (error) throw error;
}
