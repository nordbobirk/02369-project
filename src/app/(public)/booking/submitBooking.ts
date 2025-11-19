"use server";

import { initServerClient } from "@/lib/supabase/server";
import { BookingFormData, TattooData } from "./_components/Form";
import { inspect } from "util";
import { Size } from "@/lib/types";

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
  const bookingCreateResult = await supabase
    .from("bookings")
    .insert({
      email: bookingFormData.customerEmail,
      phone_number: bookingFormData.customerPhone,
      name: bookingFormData.customerName,
      date_and_time: bookingFormData.dateTime,
      is_FirstTattoo: bookingFormData.isFirstTattoo,
    })
    .select("id");
  if (!bookingCreateResult.data) {
    throw new Error("Failed to create booking");
  }
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
