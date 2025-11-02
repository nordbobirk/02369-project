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
                booking_images (
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
 * TODO: implement:
 *      Important. add security. right now one can edit status of any booking by knowing the id.
 *          this can lead to stupid situations...
 *      add docstrings
 */

/**
 * Accepts a pending booking with the given id.
 * @param params - The id of the pending booking to accept.
 * @throws {Error} If there is an error updating the booking status.
 */
export async function acceptPendingBooking(params: string | Array<string> | undefined) {

    const supabase = await initServerClient()
    const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', params)

    if (error) throw error
    revalidatePath('/dashboard/pending_bookings' + params)
    return
}

/**
 * Rejects a pending booking with the given id.
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
    revalidatePath('/dashboard/pending_bookings/' + params)
    return
}
