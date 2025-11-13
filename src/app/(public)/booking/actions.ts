"use server"

import * as React from "react"
import { initServerClient } from "@/lib/supabase/server";

export type availability = {
  date: Date
  is_open: Boolean
}

export type booking = {
  id: string
  date_and_time: Date
  total_duration?: number
}

// FIXME duration should be factored in ..
// PO said to assign random value 1-4,
// until we get/develop a concrete duration estimation algorithm
// (maybe used fixed for ease of use while developing)
// note to self: tattoos has duration column

// startDate and endDate should month based
// When looking at the calendar, it should take the date top left and bottom
// TODO Reuse functions in /dashboard/actions.ts?
export async function getAvailability() {
  const supabase = await initServerClient()
  
  const { data:availabilityTable, error } = await supabase
    .from('Tilgængelighed')
    .select('date, is_open')
    // Should maybe be false, 
    // if we assume days are closed if not true.
    // Might clash with customer opening days blocks at a time
    .eq('is_open', true)
  
  return availabilityTable as availability[]
}

export async function getBookings(): Promise<booking[]> {
  const supabase = await initServerClient()
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, date_and_time, tattoos(estimated_duration)')
    .in('status', ['pending', 'confirmed'])
  
  const bookingsWithDuration = bookings?.map(booking => ({
    ...booking,
    total_duration: booking.tattoos?.reduce((sum, tattoo) => 
    sum + (tattoo.estimated_duration || 0), 0) || 0
  }))
  // TODO the whole tattoo object is also fetched
  // Might not mean much with current load
  // But will probably be a problem in the future
  
  return bookingsWithDuration as booking[]
  
}
