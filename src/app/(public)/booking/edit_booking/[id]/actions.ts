'use server'

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache'

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

export async function updateTattooDetails(
    tattooId: string,
    width: number | undefined,
    height: number | undefined,
    placement: string,
    detailLevel: string,
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
