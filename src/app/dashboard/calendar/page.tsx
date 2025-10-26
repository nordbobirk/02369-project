import { Button } from "@/components/ui/button"
import * as React from "react"
import { ExternalLink, ExternalLinkIcon, LinkIcon } from "lucide-react";
import { initServerClient } from "@/lib/supabase/server";

import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from '@/components/ui/full-calendar';
import { addHours } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';



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

export default async function Page() {
  const events = await getAllBookings();
  return (
    <Calendar 
    events={events}>
   
      <div className="h-dvh py-3 sm:py-6 flex flex-col">
        <div className="flex flex-col sm:flex-row px-3 sm:px-6 items-stretch sm:items-center gap-2 sm:gap-2 mb-3 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-2">
            <CalendarViewTrigger className="aria-[current=true]:bg-accent flex-1 sm:flex-none" view="day">
              Day
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="week"
              className="aria-[current=true]:bg-accent flex-1 sm:flex-none"
            >
              Week
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="month"
              className="aria-[current=true]:bg-accent flex-1 sm:flex-none"
            >
              Month
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="year"
              className="aria-[current=true]:bg-accent flex-1 sm:flex-none"
            >
              Year
            </CalendarViewTrigger>
          </div>

          <span className="hidden sm:block sm:flex-1" />

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <CalendarCurrentDate />
            
            <div className="flex items-center gap-1 sm:gap-2">
              <CalendarPrevTrigger>
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                <span className="sr-only">Previous</span>
              </CalendarPrevTrigger>
              <CalendarTodayTrigger>Today</CalendarTodayTrigger>
              <CalendarNextTrigger>
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                <span className="sr-only">Next</span>
              </CalendarNextTrigger>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 sm:px-6 relative">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </Calendar>
  )
}