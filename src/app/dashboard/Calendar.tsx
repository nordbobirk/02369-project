"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getBookingsAtDate, Booking, Tattoo, Tattoo_images } from "./actions"
import { da } from "date-fns/locale"
import {
  DetailLevel,
  Placement,
  Size,
  TattooColor,
  TattooType,
} from "@/lib/types";



export default function Calendar31() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    setDate(date)
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getBookingsAtDate(date).then((response) => {
      setLoading(false)
      setBookings(response)
    })
  }, [date])



  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={da}
          className="bg-transparent p-0"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-l px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date.toLocaleDateString("da-DK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

        </div>
        <div className="flex w-full flex-col gap-2">
          {/* DO NOT TOUCH MY SPINNER ! */}
          {loading ? <p className="animate-spin flex justify-center text-4xl text-bold">c</p> : bookings.length > 0 ? bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium">{booking.name}</div>
              <div className="text-muted-foreground text-xs">
                {booking.tattoos.length == 0 ? <p>Ingen tatovering med booking</p> :
                  booking.tattoos.length > 1 ? <p>Flere tatoveringer i booking</p> :
                    <div>
                      <div>
                        Varighed: {booking.tattoos.at(0)?.estimated_duration?.toString()} minutter 
                      </div>
                      <div>
                        Kompleksitet: {booking.tattoos.at(0)?.detail_level?.toString()} 
                      </div>
                    </div>}
              </div>
            </div>
          )) : <p>Ingen bookinger i dag</p>
          }
        </div>
      </CardFooter>
    </Card>
  )
}
