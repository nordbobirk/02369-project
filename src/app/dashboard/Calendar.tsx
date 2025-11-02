"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getBookingsAtDate, getAllBookings, Booking, Tattoo } from "./actions"
import { da } from "date-fns/locale"
import ViewBooking from "./ViewBooking"
import BookingCard from "./Booking"

export default function Calendar31() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [allBookings, setAllBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    setDate(date)
  }, [])


  // Get all bookings for the dots on the calendar preview
  React.useEffect(() => {
    getAllBookings().then((response) => {
      setAllBookings(response || [])
    })
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getBookingsAtDate(date).then((response) => {
      setLoading(false)
      setBookings(response)
    })
  }, [date])

  // Converting the bookings into dates that the calendar can render
  const statusModifiers = React.useMemo(() => {
    const modifiers: Record<string, Date[]> = {
      pending: [],
      edited: [],
      confirmed: [],
    }

    allBookings.forEach((b) => {
      const d = new Date(b.date_and_time)
      d.setHours(0, 0, 0, 0)
      if (b.status && modifiers[b.status]) {
        modifiers[b.status].push(d)
      }
    })

    return modifiers
  }, [allBookings])

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={da}
          modifiers={statusModifiers}
          modifiersClassNames={{
            pending:
              "relative after:absolute after:bottom-1 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-yellow-400",
            edited:
              "relative after:absolute after:bottom-1 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-yellow-400",
            confirmed:
              "relative after:absolute after:bottom-1 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-green-500",
          }}
          className="bg-transparent p-0 [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
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
            <BookingCard booking={booking} key={booking.id}></BookingCard>
          )) : <p>Ingen bookinger i dag</p>
          }
        </div>
      </CardFooter>
    </Card>
  )
}
