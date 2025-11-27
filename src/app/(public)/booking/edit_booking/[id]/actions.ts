"use server";

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import { generateOTPData, verifyOTP } from "./otp_utils";
import { sendEmail } from "@/lib/email/send";
import { getNotificationEmail } from "@/lib/email/getNotificationEmail";
import BookingCancelledByCustomer from "@/components/email/artist/BookingCancelledByCustomer";
import {
  getBookingTime,
  getBookingTimeString,
} from "@/lib/validateBookingTime";
import BookingMovedByCustomer from "@/components/email/artist/BookingMovedByCustomer";

// --- TYPES ---

type Tattoo_images = {
  id: string;
  tattoo_id: string;
  image_url: string;
};

type Tattoo = {
  id: string;
  notes: string;
  booking_id: string;
  estimated_price: number;
  estimated_duration: number;
  images: Tattoo_images[];
};

type Booking = {
  id: string;
  email: string;
  phone_number: string;
  name: string;
  date_and_time: string;
  created_at: string;
  status: string;
  is_FirstTattoo: boolean;
  internal_notes: string;
  edited_date_and_time: string | null;
  tattoos: Tattoo[];
  otp_hash: string;
};

// --- SERVER ACTIONS ---

export async function getPendingBookingById(params: string) {
  const supabase = await initServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
            *,
            tattoos (
                *,
                tattoo_images (
                    id,
                    image_url
                )
            )
        `
    )
    .eq("id", params)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Booking[];
}

export async function cancelBooking(bookingId: string) {
  const supabase = await initServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "customer_cancelled" })
    .eq("id", bookingId)
    .select("id, name, date_and_time");

  if (error) throw error;

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error("failed to load booking");
  }

  await sendEmail({
    to: await getNotificationEmail(),
    subject: "Booking aflyst",
    content: BookingCancelledByCustomer({
      bookingRequestId: data[0].id,
      bookingTime: getBookingTimeString(getBookingTime(data)),
      customerName: data[0].name,
    }),
  });

  revalidatePath(`/dashboard/view_booking/${bookingId}`);
  return;
}

export async function validateBookingOtp(bookingId: string, inputCode: string) {
  const bookings = await getPendingBookingById(bookingId);

  if (!bookings || bookings.length === 0) {
    return { success: false, message: "Booking not found" };
  }

  const storedHash = bookings[0].otp_hash;
  const isValid = verifyOTP(inputCode, storedHash);

  if (isValid) {
    return { success: true };
  } else {
    return { success: false, message: "Invalid code" };
  }
}

export async function updateBookingDate(bookingId: string, newDate: Date) {
  const supabase = await initServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .update({
      date_and_time: newDate.toISOString(),
      edited_date_and_time: new Date().toISOString(),
      status: "edited", // <--- Added status update here
    })
    .eq("id", bookingId)
    .select("id, date_and_time, name");

  if (error) {
    console.error("Error updating booking date:", error);
    return { success: false, error: error.message };
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error("failed to load booking");
  }

  await sendEmail({
    to: await getNotificationEmail(),
    subject: "Booking ændret",
    content: BookingMovedByCustomer({
      bookingRequestId: data[0].id,
      bookingTime: getBookingTimeString(getBookingTime(data[0].date_and_time)),
      customerName: data[0].name,
    }),
  });

  revalidatePath(`/booking/edit_booking/${bookingId}`);
  revalidatePath(`/dashboard/view_booking/${bookingId}`);

  return { success: true };
}
