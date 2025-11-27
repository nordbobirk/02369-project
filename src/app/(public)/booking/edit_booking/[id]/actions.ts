"use server";

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache';
import path from "path";
import fs from "fs/promises";
import { generateOTPData, verifyOTP } from "./otp_utils";

// --- TYPES ---

type Tattoo_images = {
    id: string,
    tattoo_id: string,
    image_url: string
}

type Tattoo = {
    id: string,
    notes: string,
    booking_id: string,
    estimated_price: number,
    estimated_duration: number,
    images: Tattoo_images[],
}

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
}

// --- SERVER ACTIONS ---


export async function getPendingBookingById( params : string ) {
    const supabase = await initServerClient()

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            tattoos (
                *,
                tattoo_images (
                    id,
                    image_url
                )
            )
        `)
        .eq('id', params)
        .order('created_at', { ascending: false })

    if (error) throw error

    return data as Booking[]
}

export async function cancelBooking(bookingId: string) {
    const supabase = await initServerClient()

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'customer_cancelled' })
        .eq('id', bookingId)

    if (error) throw error

    revalidatePath(`/dashboard/view_booking/${bookingId}`)
    return
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
    const supabase = await initServerClient()

    const { error } = await supabase
        .from('bookings')
        .update({
            date_and_time: newDate.toISOString(),
            edited_date_and_time: new Date().toISOString(),
            status: 'edited' // <--- Added status update here
        })
        .eq('id', bookingId)

    if (error) {
        console.error('Error updating booking date:', error)
        return { success: false, error: error.message }
    }

    revalidatePath(`/booking/edit_booking/${bookingId}`)
    revalidatePath(`/dashboard/view_booking/${bookingId}`)

    return { success: true }
}

export async function backfillMissingOTPs() {
  const supabase = await initServerClient();
  
  const filePath = path.join(process.cwd(), "temp_otps.txt");
  console.log(">>> 📂 TARGET FILE PATH:", filePath);
  console.log(">>> Starting OTP Backfill...");

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, email, name");

  if (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: error.message };
  }

  if (!bookings || bookings.length === 0) {
    console.log(">>> No bookings found.");
    return { success: true, message: "No bookings found." };
  }

  console.log(`>>> Found ${bookings.length} bookings. Generating new links...`);

  let logBuffer = `\n--- BACKFILL RUN (${new Date().toLocaleTimeString()}) ---\n`;
  let updateCount = 0;

  for (const booking of bookings) {
    const { code, hash } = generateOTPData();

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ otp_hash: hash })
      .eq("id", booking.id);

    if (updateError) {
      console.error(`Failed to update booking ${booking.id}:`, updateError);
      continue;
    }

    const magicLink = `http://localhost:3000/booking/edit_booking/${booking.id}?code=${code}`;
    logBuffer += `[BACKFILL] Name: ${booking.name} | Link: ${magicLink}\n`;
    updateCount++;
  }

  if (updateCount > 0) {
    try {
      await fs.appendFile(filePath, logBuffer);
      console.log(`>>> ✅ SUCCESSFULLY wrote ${updateCount} links to file.`);
    } catch (err) {
      console.error("Failed to write to file:", err);
    }
  }

  return { success: true, count: updateCount };
}