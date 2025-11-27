"use server";

import { initServerClient } from "@/lib/supabase/server";
import { BookingFormData, TattooData } from "./_components/Form";
import { Size } from "@/lib/types";
import { generateOTPData } from "@/app/(public)/booking/edit_booking/[id]/otp_utils";
import path from "path";
import fs from "fs/promises";
import { sendEmail } from "@/lib/email/send";
import BookingRequestReceived from "@/components/email/customer/BookingRequestReceived";
import { getEnvironmentUrl } from "@/lib/url";
import BookingRequestReceivedNotification from "@/components/email/artist/BookingRequestReceived";
import { getNotificationEmail } from "@/lib/email/getNotificationEmail";
import {
  getBookingTime,
  getBookingTimeString,
} from "@/lib/validateBookingTime";

export type BookingSubmissionInput = Omit<BookingFormData, "tattoos"> & {
  tattoos: (Omit<
    TattooData,
    "flashImage" | "customReferenceImages" | "title"
  > & {
    uploadId: string;
  })[];
};

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
      otp_hash: secureOtpHash,
    })
    .select("id");
  if (!bookingCreateResult.data) {
    throw new Error("Failed to create booking");
  }

  const bookingId = bookingCreateResult.data[0].id;

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
    .select("id, upload_id, date_and_time, name");
  if (!tattoosCreateResult.data) {
    throw new Error("Failed to create tattoos");
  }

  const data = tattoosCreateResult.data;

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error("failed to load booking");
  }

  await sendEmail({
    to: bookingFormData.customerEmail,
    subject: "Din bookinganmodning er modtaget",
    content: BookingRequestReceived({
      manageBookingLink: `${getEnvironmentUrl()}/booking/edit_booking/${bookingId}?code=${rawOtpCode}`,
    }),
  });

  await sendEmail({
    to: await getNotificationEmail(),
    subject: "Bookinganmodning indsendt",
    content: BookingRequestReceivedNotification({
      bookingRequestId: data[0].id,
      bookingTime: getBookingTimeString(getBookingTime(data[0].date_and_time)),
      customerName: data[0].name,
    }),
  });

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
