"use server";
import { initServerClient } from "@/lib/supabase/server";

export async function deleteAll() {
  const supabase = await initServerClient();

  const { error } = await supabase
    .from("bookings")
    .delete()
    .neq("id", 0); // deletes ALL rows safely

  if (error) {
    console.error("❌ Error deleting all bookings:", error);
    throw error;
  }

  return true;
}

export async function getAllBookings() {
  const supabase = await initServerClient();

  // Get open days from Tilgængelighed
  const { data: openDays, error: availabilityError } = await supabase
    .from("Tilgængelighed")
    .select("date")
    .eq("is_open", true);

  if (availabilityError) {
    console.error("❌ Error fetching availability:", availabilityError);
    return [];
  }

  const openDates = openDays.map((d) => d.date);

  // Get confirmed bookings only for open days
  const { data, error } = await supabase
    .from("bookings")
    .select("id, name, date_and_time, status")
    .eq("status", "confirmed")
    .in("date_and_time", openDates);

  if (error) {
    console.error("❌ Supabase error:", error);
    return [];
  }

  return data;
}
