"use server";

import { initServerClient } from "@/lib/supabase/server";
import {
  DetailLevel,
  Placement,
  Size,
  TattooColor,
  TattooType,
} from "@/lib/types";

export type Tattoo = {
  id: string,
  notes: string,
  booking_id: string,
  estimated_price: number,
  estimated_duration: number,
  detail_level: DetailLevel,
}

export type Booking = {
  id: string,
  email: string,
  phone: string,
  name: string,
  date_and_time: string,
  created_at: string,
  status: string,
  is_first_tattoo: boolean,
  internal_notes: string,
  edited_time_and_date: string,
  tattoos: Tattoo[],
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
    .select(`
            *,
            tattoos(*)
        `)
    .gte("date_and_time", start)
    .lte("date_and_time", end);

  console.log(bookings)
  return bookings as Booking[];
}

export async function getTodaysBookings() {
  const supabase = await initServerClient();
  const today = new Date();
  const targetDay = today.toISOString().split("T")[0];
  const start = `${targetDay}T00:00:00Z`;
  const end = `${targetDay}T23:59:59Z`;

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
            *,
            tattoos (
                *)
        `)
    .gte("date_and_time", start)
    .lte("date_and_time", end);

  console.log(bookings)
  return bookings;
}

export async function getPendingBookings() {
  const supabase = await initServerClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
            *,
            tattoos(*)
        `)
    .in("status", ["pending", "edited"])
  console.log(bookings)
  return bookings;
}

export async function getAllBookings(): Promise<Booking[]> {
  const supabase = await initServerClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      tattoos(*)
    `);

  if (error) throw error;
  return bookings as Booking[];
}

export async function getLimitedBookingsAfterDate(limit = 15, offset = 0): Promise<Booking[]> {
  const today = new Date();
  const targetDay = today.toISOString().split("T")[0];
  const start = `${targetDay}T00:00:00Z`;
  
  const supabase = await initServerClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`*, tattoos(*)`)
    .gte("date_and_time", start)
    .order("date_and_time", { ascending: true })
    .range(offset, offset + limit - 1); // Supabase uses inclusive ranges

  if (error) throw error;
  return bookings as Booking[];
}





