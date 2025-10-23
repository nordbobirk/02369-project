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

export default async function Page() {
  return (
    <Calendar
      events={[
        {
          id: '1',
          start: new Date('2025-10-26T09:30:00Z'),
          end: new Date('2025-10-26T14:30:00Z'),
          title: 'event A',
          color: 'pink',
        },
        {
          id: '2',
          start: new Date('2025-10-30T10:00:00Z'),
          end: new Date('2025-10-30T18:30:00Z'),
          title: 'event B',
          color: 'blue',
        },
        {
          id: '3',
          start: new Date('2025-10-26T15:30:00Z'),
          end: new Date('2025-10-26T20:30:00Z'),
          title: 'Tester 1',
          color: 'blue',
        },
        {
          id: '4',
          start: new Date('2025-11-01T10:00:00Z'),
          end: new Date('2025-11-01T18:30:00Z'),
          title: 'event B',
          color: 'blue',
        },
        {
          id: '5',
          start: new Date('2025-11-01T15:30:00Z'),
          end: new Date('2025-11-01T20:30:00Z'),
          title: 'Tester 1',
          color: 'green',
        },
      ]}
    >
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