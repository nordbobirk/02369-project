"use server"

import * as React from "react"
import { initServerClient } from "@/lib/supabase/server";


// FIXME duration should be factored in ..
// PO said to assign random value 1-4,
// until we get/develop a concrete duration estimation algorithm
// note to self: tattoos has duration column

// startDate and endDate should month based
// When looking at the calendar, it should take the date top left and bottom
export async function getAvailability(startDate: string, endDate: string) {
  const supabase = await initServerClient()
  
  const { data:availability, error } = await supabase
    .from('Tilgængelighed')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('is_open', true)
  

  return availability
}

export async function getBookings(startDate: string, endDate: string) {
  const supabase = await initServerClient()
  
  const { data:bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .in('status', ['pending', 'confirmed'])
  

  return bookings
}
