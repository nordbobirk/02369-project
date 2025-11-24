"use server";

import { initServerClient } from "@/lib/supabase/server";
import { BookingFormData, TattooData } from "./_components/Form";
import { inspect } from "util";
import { Size } from "@/lib/types";
import { randomInt, scryptSync, randomBytes, timingSafeEqual } from "crypto";
import path from "path";
import fs from "fs/promises";


export type BookingSubmissionInput = Omit<BookingFormData, "tattoos"> & {
  tattoos: (Omit<
    TattooData,
    "flashImage" | "customReferenceImages" | "title"
  > & {
    uploadId: string;
  })[];
};

// --- OTP HELPER FUNCTIONS ---

/**
 * Generates a 6-digit code and a salted hash.
 * Returns:
 * - code: Send this to the user (Email/SMS/UI)
 * - hash: Store this in the database
 */
function generateOTPData() {
  // 1. Generate a secure 6-digit integer (100000 to 999999)
  const code = randomInt(100000, 999999).toString();

  // 2. Create a random salt (16 bytes)
  const salt = randomBytes(16).toString("hex");

  // 3. Hash the code with the salt using scrypt (secure against brute-force)
  // 64 is the key length
  const hashBuffer = scryptSync(code, salt, 64) as Buffer;
  const hash = `${salt}:${hashBuffer.toString("hex")}`; // Store salt:hash

  return { code, hash };
}

export async function submitBooking(bookingFormData: BookingSubmissionInput) {
  const supabase = await initServerClient();

  const { code: rawOtpCode, hash: secureOtpHash } = generateOTPData();

  const bookingCreateResult = await supabase
    .from("bookings")
    .insert({
      email: bookingFormData.customerEmail,
      phone_number: bookingFormData.customerPhone,
      name: bookingFormData.customerName,
      date_and_time: bookingFormData.dateTime,
      is_FirstTattoo: bookingFormData.isFirstTattoo,
      otp_hash: secureOtpHash
    })
    .select("id");
  if (!bookingCreateResult.data) {
    throw new Error("Failed to create booking");
  }

  const bookingId = bookingCreateResult.data[0].id;

  // ---------------------------------------------------------
  // TEMP LOGGING (Now with UUID!)
  // ---------------------------------------------------------
  if (process.env.NODE_ENV === "development") {
    try {
      const filePath = path.join(process.cwd(), "temp_otps.txt");
      // Added ID to the log string
      const logEntry = `[NEW] ID: ${bookingId} | Name: ${bookingFormData.customerName} | Email: ${bookingFormData.customerEmail} | OTP: ${rawOtpCode}\n`;
      await fs.appendFile(filePath, logEntry);
      console.log(">>> Logged new booking to temp_otps.txt");
    } catch (err) {
      console.error("Log error:", err);
    }
  }
  // ---------------------------------------------------------

  const tattoosCreateResult = await supabase
    .from("tattoos")
    .insert(
      bookingFormData.tattoos.map((tattoo) => ({
        booking_id: bookingCreateResult.data[0].id,
        placement: tattoo.placement,
        height: getHeightFromSize(tattoo.size),
        width: getWidthFromSize(tattoo.size),
        notes:
          tattoo.tattooType === "flash"
            ? tattoo.flashComments
            : tattoo.customDescription,
        tattoo_type: tattoo.tattooType.toLowerCase(),
        colored_option: tattoo.colorOption.toLowerCase(),
        color_description: tattoo.colorDescription,
        detail_level: tattoo.detailLevel,
        estimated_duration: tattoo.estimated_duration,
        estimated_price: 0,
        upload_id: tattoo.uploadId,
      }))
    )
    .select("id, upload_id");
  if (!tattoosCreateResult.data) {
    throw new Error("Failed to create tattoos");
  }
  return tattoosCreateResult.data as { id: number; upload_id: string }[];
}

export async function submitFilePaths(paths: string[], tattooId: number) {
  const supabase = await initServerClient();
  await supabase.from("tattoo_images").insert(
    paths.map((path) => ({
      tattoo_id: tattooId,
      image_url: `https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/authenticated/booking_images/${path}`,
    }))
  );
}

function getHeightFromSize(size: Size): number {
  switch (size) {
    case "small":
      return 5;
    case "medium":
      return 10;
    case "large":
      return 15;
  }
}

function getWidthFromSize(size: Size): number {
  switch (size) {
    case "small":
      return 5;
    case "medium":
      return 10;
    case "large":
      return 15;
  }
}
