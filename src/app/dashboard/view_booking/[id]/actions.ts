'use server'

import BookingCancelledByArtist from "@/components/email/customer/BookingCancelledByArtist";
import BookingRequestApproved from "@/components/email/customer/BookingRequestApproved";
import { sendEmail } from "@/lib/email/send";
import { getCustomerEmail } from "@/lib/email/validate";
import { initServerClient } from "@/lib/supabase/server";
import { getBookingTime, getBookingTimeString } from "@/lib/validateBookingTime";
import { revalidatePath } from 'next/cache'

/**
 * Generates a signed URL for a private tattoo image stored in Supabase Storage.
 *
 * Parses the image URL to extract the bucket name and file path, then creates
 * a temporary signed URL that allows authenticated access to the private image
 * for 1 hour.
 *
 * @param imageUrl - The full Supabase storage URL or relative path to the image.
 *                   Format: `https://[project].supabase.co/storage/v1/object/[public|authenticated]/[bucket]/[path]`
 *                   or just `[path]` (assumes 'tattoo-images' bucket).
 * @returns {Promise<string>} A signed URL that provides temporary access to the image,
 *                            or the original URL if signing fails.
 * @throws Does not throw - returns original URL on error and logs to console.
 */
export async function getTattooImageSignedUrl(imageUrl: string) {
    const supabase = await initServerClient()

    // Extract path from the full Supabase storage URL
    // Format: https://[project].supabase.co/storage/v1/object/[public|authenticated]/[bucket]/[path]

    // First, try to extract bucket and path
    let bucket = '';
    let path = '';

    // Check if it's a full URL
    if (imageUrl.includes('/storage/v1/object/')) {
        // Split by /storage/v1/object/
        const parts = imageUrl.split('/storage/v1/object/');
        if (parts.length >= 2) {
            // Remove 'public' or 'authenticated' prefix if present
            const afterStorage = parts[1].replace(/^(public|authenticated)\//, '');
            const pathParts = afterStorage.split('/');

            if (pathParts.length >= 2) {
                bucket = pathParts[0];
                path = pathParts.slice(1).join('/');
            }
        }
    } else {
        // If it's already just a path, assume bucket is 'tattoo-images'
        bucket = 'tattoo-images';
        path = imageUrl;
    }

    if (!bucket || !path) {
        console.error('Could not parse bucket and path from URL:', imageUrl); // left for debugging
        return imageUrl;
    }

    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600) // 1 hour expiry

    if (error) {
        console.error('Error creating signed URL:', error); // left for debugging
        return imageUrl;
    }

    return data.signedUrl;
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

    // Generate signed URLs for all images
    if (data && data[0]?.tattoos) {
        for (const tattoo of data[0].tattoos) {
            if (tattoo.tattoo_images) {
                for (const image of tattoo.tattoo_images) {
                    image.image_url = await getTattooImageSignedUrl(image.image_url)
                }
            }
        }
    }

    return data
}

/**
 * Accepts a pending booking with the given id.
 *
 * @param params - The id of the pending booking to accept.
 * @throws {Error} If there is an error updating the booking status.
 */
export async function acceptPendingBooking(params: string | Array<string> | undefined) {

    const supabase = await initServerClient()
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', params)
        .select("email")

    if (error) throw error

    await sendEmail({
        to: getCustomerEmail(data),
        subject: "Din bookinganmodning er blevet godkendt",
        content: BookingRequestApproved(),
    })

    revalidatePath('/dashboard/view_booking' + params)
    return
}

/**
 * Rejects a pending booking with the given id.
 *
 * @param params - The id of the pending booking to reject.
 * @throws {Error} If there is an error updating the booking status.
 */
export async function rejectPendingBooking(params: string | Array<string> | undefined) {

    const supabase = await initServerClient()
    const { error } = await supabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', params)

    if (error) throw error
    revalidatePath('/dashboard/view_booking/' + params)
    return
}

/**
 * Updates the booking details with the provided new values.
 *
 * @param bookingId - The id of the booking to update.
 * @param email - The new email for the booking.
 * @param phoneNumber - The new phone number for the booking.
 * @param internalNotes - The new internal notes for the booking.
 * @throws {Error} If there is an error updating the booking details.
 */
export async function updateBookingDetails(
    bookingId: string,
    email: string,
    phoneNumber: string,
    internalNotes: string
) {
    const supabase = await initServerClient()

    const { error } = await supabase
        .from('bookings')
        .update({
            email,
            phone_number: phoneNumber,
            internal_notes: internalNotes,
            edited_date_and_time: new Date().toISOString()
        })
        .eq('id', bookingId)

    if (error) throw error

    revalidatePath(`/dashboard/view_booking/${bookingId}`)
    return
}

/**
 * Updates the tattoo details with the provided new values.
 *
 * @param tattooId - The id of the tattoo to update.
 * @param width - The new width for the tattoo.
 * @param height - The new height for the tattoo.
 * @param placement - The new placement for the tattoo.
 * @param detailLevel - The new detail level for the tattoo.
 * @param coloredOption - The new colored option for the tattoo.
 * @param colorDescription - The new color description for the tattoo.
 * @throws {Error} If there is an error updating the tattoo details.
 */
export async function updateTattooDetails(
    tattooId: string,
    width: number | undefined,
    height: number | undefined,
    placement: string,
    detailLevel: string | null,
    coloredOption: string,
    colorDescription: string
) {
    const supabase = await initServerClient()

    const updateData: any = {
        width,
        height,
        placement,
        detail_level: detailLevel,
        colored_option: coloredOption,
    }

    // Kun tilføj color_description hvis coloredOption er 'colored'
    if (coloredOption === 'colored') {
        updateData.color_description = colorDescription
    } else {
        updateData.color_description = null
    }

    const { error } = await supabase
        .from('tattoos')
        .update(updateData)
        .eq('id', tattooId)

    if (error) throw error

    // Hent booking_id for at kunne revalidate den korrekte path
    const { data: tattoo } = await supabase
        .from('tattoos')
        .select('booking_id')
        .eq('id', tattooId)
        .single()

    if (tattoo?.booking_id) {
        revalidatePath(`/dashboard/view_booking/${tattoo.booking_id}`)
    }

    return
}

/**
 * Cancels a confirmed booking by changing its status to 'artist_cancelled'.
 *
 * @param bookingId - The id of the booking to cancel.
 * @throws {Error} If there is an error updating the booking status.
 */
export async function cancelBooking(bookingId: string) {
    const supabase = await initServerClient()

    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'artist_cancelled' })
        .eq('id', bookingId)
        .eq('status', 'confirmed') // Extra sikkerhed - kun confirmed bookings kan aflyses
        .select("email, date_and_time")

    if (error) throw error

    const email = getCustomerEmail(data)

    await sendEmail({
        to: email,
        subject: "Din booking er blevet aflyst",
        content: BookingCancelledByArtist({bookingTime: getBookingTimeString(getBookingTime(data))})
    })

    revalidatePath(`/dashboard/view_booking/${bookingId}`)
    return
}
