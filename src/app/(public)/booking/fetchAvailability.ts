import * as React from "react"
import { initServerClient } from "@/lib/supabase/server";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tilt_Neon } from "next/font/google";


async function getAllBookings() {
  const supabase = await initServerClient();
  const { data: bookings, error } = await supabase.from("bookings").select();

  // Right now, we use the "CalendarEvent" type from full-calendar.tsx
  // We might need to change this, or how the CalendarEvent is defined
  // If we need more information when the events are shown in calendar
  return bookings?.map((booking) => {
    const startDate = new Date(booking.date_and_time);
    // Calculate end time based on duration
    const endDate = new Date(startDate.getTime() + booking.duration * 60000);

    return {
      id: booking.id.toString(),
      start: startDate,
      end: endDate,
      title: booking.name,
      // This is janky, but because of how EventVariants 
      // are defined in full-calendar.tsx, this is how it is for now
      color: booking.status === 'confirmed' ? 'green' as const :
        booking.status === 'pending' ? 'orange' as const :
          'blue' as const,
    };
  }) || [];
}

async function fetchAvailability() {
    const supabase = await initServerClient();
    const {data: Tilgængelighed, error} = await supabase.from("Tilgængelighed").select("date, is_open");


    // FIXME Duration is assigned at random until 
    // duration estimate algorithm is complete

    return Tilgængelighed?.map((tilgængelighed) => {
        return {
            date: tilgængelighed.date,
            status: tilgængelighed.is_open,
            duration: Math.floor((Math.random()*4)+1)
        }
        
    })
}