"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"
import Calendar from "./Calendar";
import { ExternalLink, ExternalLinkIcon, LinkIcon } from "lucide-react";

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
      <div className="flex justify-center pb-10 border-b mx-2">
        <Calendar />
      </div>

      <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-6 px-4 mt-8">
        <div
          className=" lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]">
          <div>
            <p className="border-b p-6 font-medium">Pending booking requests</p>
          </div>
          <div className="p-4">
            {bookings.map((booking) => (
              <div
                key={booking.title}
                className="mb-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between"
              >
                <div>
                  <div className="font-medium">{booking.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {booking.content}
                  </div>
                </div>
                <Button>
                  View
                  <ExternalLinkIcon/>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className=" lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]  ">
          <div>
            <p className="border-b p-6 font-medium">Today's bookings</p>
          </div>
          <div className="p-4">
            {bookings.map((booking) => (
              <div
                key={booking.title}
                className="mb-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between"
              >
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
