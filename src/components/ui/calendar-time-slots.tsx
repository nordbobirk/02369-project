"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getAvailability, getAvailableSlots, getBookings } from "@/app/(public)/booking/actions"
import { isToday } from "date-fns"

export function Calendar20() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date()
  )
  const [selectedTime, setSelectedTime] = React.useState<string | null>("10:00")
  const timeSlots = Array.from({ length: 4 }, (_, i) => {
    //FIXME Logic here to handle lunch breaks and other changes to 
    const totalMinutes = i * 120
    const hour = Math.floor(totalMinutes / 60) + 10
    const minute = totalMinutes % 60
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const bookedDates = Array.from(
    { length: 3 },
    (_, i) => new Date(2025, 5, 17 + i)
  )

 
    const [displayedMonth, setDisplayedMonth] = React.useState<Date>(
    new Date(2025, 5, 1)
    )

// Calculate the first and last visible dates in the calendar grid
const getCalendarBounds = (monthDate: Date) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  
  // First day of the displayed month
  const firstDayOfMonth = new Date(year, month, 1)
  const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday
  
  // Calculate the first visible date (might be from previous month)
  const firstVisibleDate = new Date(firstDayOfMonth)
  firstVisibleDate.setDate(firstVisibleDate.getDate() - firstDayOfWeek)
  
  // Last day of the displayed month
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const lastDayOfWeek = lastDayOfMonth.getDay()
  
  // Calculate the last visible date (might be from next month)
  const lastVisibleDate = new Date(lastDayOfMonth)
  lastVisibleDate.setDate(lastVisibleDate.getDate() + (6 - lastDayOfWeek))
  
  return { firstVisibleDate, lastVisibleDate }
}



const { firstVisibleDate, lastVisibleDate } = getCalendarBounds(displayedMonth)

const [unavailableDays, setBookedDays] = React.useState<Date[]>([])

  

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            disabled={unavailableDays}
            showOutsideDays={true}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString("dk", { weekday: "short" })
              },
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Din aftale vil blive lagt {" "}
              <span className="font-medium">
                {" "}
                {date?.toLocaleDateString("dk", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
              </span>
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Vælg dag og tid for din aftale.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full md:ml-auto md:w-auto"
          variant="outline"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}