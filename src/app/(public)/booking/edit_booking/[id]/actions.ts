'use server'

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache'
import { randomBytes, randomInt, scryptSync, timingSafeEqual } from "crypto";
import path from "path";
import fs from "fs/promises";


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
    otp_hash: string;
}


/**
 * Fetches a booking by its id. The booking includes all its tattoos and their images.
 *
 * @param params - The id of the booking to fetch.
 * @returns {Promise<Booking>} The booking data.
 * @throws {Error} If there is an error fetching the booking.
 */
export async function getPendingBookingById( params : string ) {
    const supabase = await initServerClient()

    const { data, error } = await supabase
        // TODO: fix such that fields are specified and not everything (*).
        //       dont wanna do this before the database is set up though..
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
        // .in('status', ['pending', 'edited'])
        .order('created_at', { ascending: false })

    if (error) throw error

    return data
}


/**
 * Cancels a confirmed booking by changing its status to 'customer_cancelled'.
 *
 * @param bookingId - The id of the booking to cancel.
 * @throws {Error} If there is an error updating the booking status.
 */
export async function cancelBooking(bookingId: string) {
    const supabase = await initServerClient()

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'customer_cancelled' })
        .eq('id', bookingId)
        //  Denne sikkerhed er ikke nødvendig når det er en kunde
        // .eq('status', 'confirmed') // Extra sikkerhed - kun confirmed bookings kan aflyses

    if (error) throw error

    revalidatePath(`/dashboard/view_booking/${bookingId}`)
    return
}


/**
 * Verifies the OTP.
 * 1. Fetches the booking securely on the server.
 * 2. Compares the input code with the stored hash.
 */
export async function validateBookingOtp(bookingId: string, inputCode: string) {
  // 1. Fetch the booking again to get the hash securely from DB
  // (Do not pass the hash from the client)
  const bookings = await getPendingBookingById(bookingId);

  if (!bookings || bookings.length === 0) {
    return { success: false, message: "Booking not found" };
  }

  const storedHash = bookings[0].otp_hash;

  // 2. Verify using your existing logic
  const isValid = verifyOTP(inputCode, storedHash);

  if (isValid) {
    return { success: true };
  } else {
    return { success: false, message: "Invalid code" };
  }
}

function verifyOTP(inputCode: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const hashedBuffer = scryptSync(inputCode, salt, 64) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");

  return timingSafeEqual(hashedBuffer, keyBuffer);
}


// The following function are for regenerating the old booking otp_hash


// --- Helper: Generate Code & Hash ---
function generateOTPData() {
  const code = randomInt(100000, 999999).toString();
  const salt = randomBytes(16).toString("hex");
  const hashBuffer = scryptSync(code, salt, 64) as Buffer;
  const hash = `${salt}:${hashBuffer.toString("hex")}`;
  return { code, hash };
}

// --- Main Backfill Function ---
export async function backfillMissingOTPs() {
  const supabase = await initServerClient();
  
  console.log(">>> Starting OTP Backfill...");

  // 1. Fetch bookings that are missing the otp_hash
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, email, name")
    .is("otp_hash", null); // Only get rows where hash is missing

  if (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: error.message };
  }

  if (!bookings || bookings.length === 0) {
    console.log(">>> No bookings found that need an OTP.");
    return { success: true, message: "No bookings needed updates." };
  }

  let logBuffer = "\n--- BACKFILL LOG (New Run) ---\n";
  let updateCount = 0;

  // 2. Loop through every booking found
  for (const booking of bookings) {
    const { code, hash } = generateOTPData();

    // Update Supabase with the Hash
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ otp_hash: hash })
      .eq("id", booking.id);

    if (updateError) {
      console.error(`Failed to update booking ${booking.id}:`, updateError);
      continue;
    }

    // 3. Add to Log Buffer (INCLUDING THE ID/UUID)
    logBuffer += `[BACKFILL] ID: ${booking.id} | Name: ${booking.name} | Email: ${booking.email} | OTP: ${code}\n`;
    updateCount++;
  }

  // 4. Write to temp_otps.txt
  if (updateCount > 0) {
    try {
      const filePath = path.join(process.cwd(), "temp_otps.txt");
      await fs.appendFile(filePath, logBuffer);
      console.log(`>>> Successfully backfilled ${updateCount} bookings. Check temp_otps.txt for IDs.`);
    } catch (err) {
      console.error("Failed to write to file:", err);
    }
  }

  return { success: true, count: updateCount };
}
