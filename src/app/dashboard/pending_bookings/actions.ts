'use server'

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache'

export async function getPendingBookingById( params : string ) {
    const supabase = await initServerClient()

    const { data, error } = await supabase
        // TODO: fix such that fields are specified and not everything (*).
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
        // .eq('status', 'pending')
        .eq('id', params)
        .in('status', ['pending', 'edited'])
        .order('created_at', { ascending: false })

    if (error) throw error
    // console.log(error)
    console.log(data)
    return data
}

/**
 * TODO: implement:
 *      accept booking
 *      decline booking
 */
