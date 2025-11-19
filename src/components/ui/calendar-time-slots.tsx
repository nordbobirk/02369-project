"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { availability, booking, getAvailability, getBookings } from "@/app/(public)/booking/actions";
import { da } from "date-fns/locale";

export function Calendar20({
  onDateTimeChange,
  onAvailabilityChange,
  slotDuration = 30, // default slot duration in minutes
}: {
  onDateTimeChange?: (value: Date | null) => void;
  onAvailabilityChange?: (available: boolean) => void;
  slotDuration?: number;
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [availability, setAvailability] = React.useState<availability[]>([]);
  const [bookings, setBookings] = React.useState<booking[]>([]);
  const [selectedTime, setSelectedTime] = React.useState<string | null>("10:00");

  const lunchBreak = 13;
  const startHour = 10;
  const totalSlots = (7*60)/slotDuration;

  // Generate time slots based on slotDuration
  const timeSlots = Array.from({ length: totalSlots }, (_, i) => {
    const totalMinutes = i * slotDuration;
    const hour = startHour + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  }).filter((time) => {
    const [h] = time.split(":").map(Number);
    return h !== lunchBreak;
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

  // Group bookings by date (yyyy-mm-dd)
  const bookingsByDate = React.useMemo(() => {
    const map = new Map<string, booking[]>();
    bookings.forEach((b) => {
      const d = new Date(b.date_and_time);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString();
      const arr = map.get(key) || [];
      arr.push(b);
      map.set(key, arr);
    });
    return map;
  }, [bookings]);

  // Compute fully booked dates
  const fullyBookedDates = React.useMemo(() => {
    const set = new Set<string>();
    bookingsByDate.forEach((bookingsList, key) => {
      const occupied = new Set<string>();
      bookingsList.forEach((b) => {
        const start = new Date(b.date_and_time);
        const hh = start.getHours().toString().padStart(2, "0");
        const mm = start.getMinutes().toString().padStart(2, "0");
        const startStr = `${hh}:${mm}`;
        let durationMins = (b.total_duration as any) || slotDuration;
        if (!durationMins || typeof durationMins !== "number") durationMins = slotDuration;
        const slotsToOccupy = Math.max(1, Math.ceil(durationMins / slotDuration));
        const startIndex = timeSlots.indexOf(startStr);
        if (startIndex === -1) return;
        for (let i = 0; i < slotsToOccupy; i++) {
          const idx = startIndex + i;
          if (idx < timeSlots.length) occupied.add(timeSlots[idx]);
        }
      });
      if (occupied.size >= timeSlots.length) set.add(key);
    });
    return set;
  }, [bookingsByDate, timeSlots, slotDuration]);

  // Occupied times for selected date
  const occupiedTimesForSelectedDate = React.useMemo(() => {
    if (!date) return new Set<string>();
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const list = bookingsByDate.get(d.toISOString()) || [];
    const occupied = new Set<string>();
    list.forEach((b) => {
      const start = new Date(b.date_and_time);
      const hh = start.getHours().toString().padStart(2, "0");
      const mm = start.getMinutes().toString().padStart(2, "0");
      const startStr = `${hh}:${mm}`;
      let durationMins = (b.total_duration as any) || slotDuration;
      if (!durationMins || typeof durationMins !== "number") durationMins = slotDuration;
      const slotsToOccupy = Math.max(1, Math.ceil(durationMins / slotDuration));
      const startIndex = timeSlots.indexOf(startStr);
      if (startIndex === -1) return;
      for (let i = 0; i < slotsToOccupy; i++) {
        const idx = startIndex + i;
        if (idx < timeSlots.length) occupied.add(timeSlots[idx]);
      }
    });
    return occupied;
  }, [bookingsByDate, date, timeSlots, slotDuration]);

  // Clear selection if now occupied
  React.useEffect(() => {
    if (selectedTime && occupiedTimesForSelectedDate.has(selectedTime)) {
      setSelectedTime(null);
    }
  }, [selectedTime, occupiedTimesForSelectedDate]);

  const availableDates = availability.map((a) => new Date(a.date));

  const isDateAvailable = (checkDate: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.getDate() === checkDate.getDate() &&
        availableDate.getMonth() === checkDate.getMonth() &&
        availableDate.getFullYear() === checkDate.getFullYear()
    );
  };

  const isSelectionValid = React.useMemo(() => {
    if (!date) return false;
    if (!isDateAvailable(date)) return false;

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    if (fullyBookedDates.has(d.toISOString())) return false;
    return true;
  }, [date, availability, fullyBookedDates]);

  // Notify parent about selection validity and send datetime
  React.useEffect(() => {
    onAvailabilityChange?.(!!(date && selectedTime && isSelectionValid));

    if (!date || !selectedTime || !isSelectionValid) {
      onDateTimeChange?.(null);
      return;
    }

    const [h, m] = selectedTime.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(h, m, 0, 0);
    onDateTimeChange?.(combined);
  }, [date, selectedTime, isSelectionValid]);

  const disabledMatcher = (checkDate: Date) => {
    if (!isDateAvailable(checkDate)) return true;
    const d = new Date(checkDate);
    d.setHours(0, 0, 0, 0);
    return fullyBookedDates.has(d.toISOString());
  };

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
              formatWeekdayName: (d) => d.toLocaleString("dk", { weekday: "short" }),
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => {
              const isOccupied = occupiedTimesForSelectedDate.has(time);
              const isDateAvail = date ? isDateAvailable(date) : false;
              const isDisabled = !isDateAvail || isOccupied;
              return (
                <Button
                  key={time}
                  variant={isOccupied ? "ghost" : selectedTime === time ? "default" : "outline"}
                  onClick={() => !isDisabled && setSelectedTime(time)}
                  className={`w-full shadow-none ${isOccupied ? "opacity-60 cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  title={isOccupied ? "Optaget" : undefined}
                  type="button"
                >
                  {time}
                </Button>
              );
            })}
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
