import * as React from "react"
import { initServerClient } from "@/lib/supabase/server";
import CalendarSmall from "./Calendar";
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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllBookings, Tattoo } from "../actions";


async function getEventsForCalendar() {
  const bookings = await getAllBookings();

  // Right now, we use the "CalendarEvent" type from full-calendar.tsx
  // We might need to change this, or how the CalendarEvent is defined
  // If we need more information when the events are shown in calendar
  return bookings?.map((booking) => {
    const startDate = new Date(booking.date_and_time);
    // Calculate end time based on duration
    const totalDurationMinutes = booking.tattoos?.reduce(
      (acc: number, tattoo: Tattoo) => acc + tattoo.estimated_duration,
      0
    ) ?? 0;

    const endDate = new Date(startDate.getTime() + totalDurationMinutes * 60 * 1000);
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
  const events = await getEventsForCalendar();

  return (
    <div>
      <div className="block sm:hidden">
        <CalendarSmall />
      </div>
      <div className="hidden sm:block">
        <Calendar
          events={events}>
          <div className="h-dvh py-3 sm:py-6 flex flex-col">
            <div className="flex flex-col sm:flex-row px-3 sm:px-6 items-stretch sm:items-center gap-2 sm:gap-2 mb-3 sm:mb-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <CalendarViewTrigger
                  view="week"
                  className="aria-[current=true]:bg-accent flex-1 sm:flex-none"
                >
                  Uge
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="month"
                  className="aria-[current=true]:bg-accent flex-1 sm:flex-none"
                >
                  Måned
                </CalendarViewTrigger>

              </div>

              <span className="hidden sm:block sm:flex-1" />

              <div className="flex items-center gap-2 justify-between sm:justify-end">
                <CalendarCurrentDate />

                <div className="flex items-center gap-1 sm:gap-2">
                  <CalendarPrevTrigger>
                    <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                    <span className="sr-only">Forrige</span>
                  </CalendarPrevTrigger>
                  <CalendarTodayTrigger>I dag</CalendarTodayTrigger>
                  <CalendarNextTrigger>
                    <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                    <span className="sr-only">Næste</span>
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
      </div>
    </div>
  )
}