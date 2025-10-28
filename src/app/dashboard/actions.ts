"use server";

import { initServerClient } from "@/lib/supabase/server";

type Booking = {
    id: string,
    name: string,
    date_and_time: string,
}

export async function getBookingsAtDate(date: Date) {
    const supabase = await initServerClient();

    const targetDay = date.toISOString().split("T")[0];

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Convert them to ISO strings (which are UTC)
    const start = startOfDay.toISOString();
    const end = endOfDay.toISOString();

    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("id, name, date_and_time")
        .gte("date_and_time", start)
        .lte("date_and_time", end);

    return bookings as Booking[];
}

export function getTimeUntilBooking(date_and_time: string): string {
  const now = new Date();
  const bookingDate = new Date(date_and_time);

  const diffMs = bookingDate.getTime() - now.getTime();

  if (diffMs <= 0) return "Booking time has passed";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days} Dage, ${hours} Timer, ${minutes} Minuter indtil bookingen`;
}

export async function getTodaysBookings() {
  const supabase = await initServerClient();
  const today = new Date();
  const targetDay = today.toISOString().split("T")[0]; 
  const start = `${targetDay}T00:00:00Z`;
  const end = `${targetDay}T23:59:59Z`;

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("date_and_time", start)
    .lte("date_and_time", end);

  return bookings;
}
