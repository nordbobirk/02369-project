"use server"

import * as React from "react"
import { initServerClient } from "@/lib/supabase/server";


// FIXME duration should be factored in ..
// PO said to assign random value 1-4,
// until we get/develop a concrete duration estimation algorithm
// (maybe used fixed for ease of use while developing)
// note to self: tattoos has duration column

// startDate and endDate should month based
// When looking at the calendar, it should take the date top left and bottom
// TODO Reuse functions in /dashboard/actions.ts?
export async function getAvailability(startDate: Date, endDate: Date) {
  const supabase = await initServerClient()
  
  const { data:availability, error } = await supabase
    .from('Tilgængelighed')
    .select('date, is_open')
    .gte('date', startDate)
    .lte('date', endDate)
    // Should maybe be false, 
    // if we assume days are open if not false.
    // Might clash with customer opening days blocks at a time
    //.eq('is_open', true)
  

  return availability
}

export async function getBookings(startDate: Date, endDate: Date) {
  const supabase = await initServerClient()
  
  const { data:bookings, error } = await supabase
    .from('bookings')
    .select('date_and_time')
    .gte('date_and_time', startDate)
    .lte('date_and_time', endDate)
    .in('status', ['pending', 'confirmed'])
  

  return bookings
}

// AI-gen helper function
export async function getAvailableSlots(startDate: Date, endDate: Date) {
  const [availability, bookings] = await Promise.all([
    getAvailability(startDate, endDate),
    getBookings(startDate, endDate)
  ])
  
  // Convert bookings to a Set for quick lookup
  const bookedSlots = new Set(
    bookings?.map(b => b.date_and_time) || []
  )
  
  // Filter availability and remove booked slots
  const availableDates = availability
    ?.filter(a => a.is_open)
    .map(a => a.date) || []
  
  return {
    availableDates,
    bookedSlots: Array.from(bookedSlots)
  }
}   
