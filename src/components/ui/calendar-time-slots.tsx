"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { availability, booking, getAvailability, getBookings } from "@/app/(public)/booking/actions"
import { da } from "date-fns/locale"

export function Calendar20({
  onDateTimeChange,
}: {
  onDateTimeChange?: (value: Date | null) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [availability, setAvailability] = React.useState<availability[]>([]);
  const [bookings, setBookings] = React.useState<booking[]>([]);
  const [selectedTime, setSelectedTime] = React.useState<string | null>("10:00");

  const lunchBreak = 13;

  const timeSlots = Array.from({ length: 7 }, (_, i) => {
    const totalMinutes = i * 60;
    const hour = Math.floor(totalMinutes / 60) + 10;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  }).filter((_, i) => {
    const hour = Math.floor((i * 60) / 60) + 10;
    return hour !== lunchBreak;
  });

  React.useEffect(() => {
    getAvailability().then((response) => {
      setAvailability(response || []);
    });
  }, []);

  React.useEffect(() => {
    getBookings().then((response) => {
      setBookings(response || []);
    });
  }, []);

  // send combined datetime to parent
  React.useEffect(() => {
    if (!date || !selectedTime) {
      onDateTimeChange?.(null);
      return;
    }

    const [h, m] = selectedTime.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(h, m, 0, 0);

    onDateTimeChange?.(combined);
  }, [date, selectedTime]);

  const availableDates = availability.map(a => new Date(a.date));

  const isDateAvailable = (checkDate: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.getDate() === checkDate.getDate() &&
        availableDate.getMonth() === checkDate.getMonth() &&
        availableDate.getFullYear() === checkDate.getFullYear()
    );
  };

  const disabledMatcher = (date: Date) => !isDateAvailable(date);

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={da}
            defaultMonth={date}
            disabled={disabledMatcher}
            showOutsideDays={true}
            modifiers={{ available: availableDates }}
            modifiersClassNames={{ available: "" }}
            className="bg-transparent p-0 [--cell-size:--spacing(8)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString("dk", { weekday: "short" }),
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
              Din aftale vil blive lagt{" "}
              <span className="font-medium">
                {date?.toLocaleDateString("dk", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>{" "}
              kl. <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Vælg dag og tid for din aftale.</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
