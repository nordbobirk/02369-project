"use client"

import { Button } from "@/components/ui/button"
import { CalendarIcon, HomeIcon, SettingsIcon } from "lucide-react";

import * as React from "react"
import Calender31 from "./calendar-31"

// TODO get bookings from database
const bookings = [
  {
    title: "Booking 1",
    content: "Important content",
  },
  {
    title: "Booking 2",
    content: "Important content",
  },
  {
    title: "Booking 3",
    content: "Important content",
  },
  {
    title: "Booking 4",
    content: "Important content",
  },
  {
    title: "Booking 5",
    content: "Important content",
  },
]

export default function Home() {

  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <>

      <div className="m-8 flex border shadow-sm rounded-xl p-3">
        <Button variant={"secondary"}> 
          <HomeIcon />Home
        </Button>
        <Button variant={"secondary"}>
          <CalendarIcon/> Calendar
        </Button>
        <Button variant={"secondary"}>
          <SettingsIcon/>Settings
        </Button>
      </div>

      <div className="flex justify-center pb-10 border-b shadow-sm">
        <Calender31></Calender31>
      </div>
      <div className="flex justify-center">
      <div className="m-10 rounded-xl border shadow-sm min-w-100">
        <div>
          <p className="border-b p-6">Pending booking requests</p>
        </div>
        <div className="p-4">
          {bookings.map((booking) => (
            <div
            key={booking.title}
            className="mb-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between">
                          <div>
                            <div className="font-medium">{booking.title}</div>
                            <div className="text-muted-foreground text-xs">
                              {booking.content}
                            </div>
                          </div>
                          <Button>View booking</Button>
                      </div>
            ))}
        </div>
      </div>
      
      <div className="m-10 rounded-xl border shadow-sm min-w-100">
        <div>
          <p className="border-b p-6">Todays bookings</p>
        </div>
        <div className="p-4">
          {bookings.map((booking) => (
            <div
            key={booking.title}
            className="mb-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between">
                          <div>
                            <div className="font-medium">{booking.title}</div>
                            <div className="text-muted-foreground text-xs">
                              {booking.content}
                            </div>
                          </div>
                          
                      </div>
            ))}
        </div>
      </div>
    </div>

    </>
  );
}
