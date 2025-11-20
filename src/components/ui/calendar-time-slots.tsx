"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { availability, booking, getAvailability, getBookings } from "@/app/(public)/booking/actions";
import { da } from "date-fns/locale";

// Giga scuffed compononent. Browse/debug at your own risk.


/**
 * Smart Calendar picker:
 * - slotDuration: base increment (default 30)
 * - desiredDuration: desired tattoo duration in minutes (REQUIRED to compute optimal slots)
 */
export function Calendar20({
  onDateTimeChange,
  onAvailabilityChange,
  slotDuration = 30, // base slot length in minutes (30)
  desiredDuration, // tattoo duration in minutes (REQUIRED)
}: {
  onDateTimeChange?: (value: Date | null) => void;
  onAvailabilityChange?: (available: boolean) => void;
  slotDuration?: number;
  desiredDuration?: number;
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [availability, setAvailability] = React.useState<availability[]>([]);
  const [bookings, setBookings] = React.useState<booking[]>([]);
  const [selectedTime, setSelectedTime] = React.useState<string | null>("10:00");

  // Business hours and lunch rules
  const startHour = 10;
  const endHour = 17; // exclusive end (closing at 17:00)
  const workMinutes = (endHour - startHour) * 60;
  const totalSlots = Math.floor(workMinutes / slotDuration); // number of discrete slots in the day
  // Lunch can move in 30-min increments, from 12:00 start to 14:00 start (inclusive)
  const lunchDurationMins = 60;
  const lunchDefaultStartHour = 13;
  // generate lunch start options (in minutes from midnight) at half-hour increments
  const lunchStarts = [
    { h: 12, m: 0 },
    { h: 12, m: 30 },
    { h: 13, m: 0 },
    { h: 13, m: 30 },
    { h: 14, m: 0 },
  ].map(({ h, m }) => h * 60 + m);

  // Build an array of time slot strings for the day (10:00, 10:30, ...)
  const rawTimeSlots = React.useMemo(() => {
    return Array.from({ length: totalSlots }, (_, i) => {
      const minutesFromStart = i * slotDuration;
      const totalMinutes = startHour * 60 + minutesFromStart;
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    });
  }, [totalSlots, slotDuration]);

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

  // Group bookings by date (yyyy-mm-dd via midnight ISO)
  const bookingsByDate = React.useMemo(() => {
    const map = new Map<string, booking[]>();
    bookings.forEach((b) => {
      const d = new Date(b.date_and_time);
      d.setHours(0, 0, 0, 0);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      const arr = map.get(key) || [];
      arr.push(b);
      map.set(key, arr);
    });
    return map;
  }, [bookings]);

  // Utility: convert "HH:MM" -> slot index or -1
  const timeToIndex = React.useCallback(
    (timeStr: string) => rawTimeSlots.indexOf(timeStr),
    [rawTimeSlots]
  );

  // Occupied times for selected date based on existing bookings (set of slot strings)
  const occupiedTimesForSelectedDate = React.useMemo(() => {
    if (!date) return new Set<string>();
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    const list = bookingsByDate.get(key) || [];
    const occupied = new Set<string>();
    list.forEach((b) => {
      const start = new Date(b.date_and_time);
      const hh = start.getHours().toString().padStart(2, "0");
      const mm = start.getMinutes().toString().padStart(2, "0");
      const startStr = `${hh}:${mm}`;
      let durationMins = (b.total_duration as any) || slotDuration;
      if (!durationMins || typeof durationMins !== "number") durationMins = slotDuration;
      const slotsToOccupy = Math.max(1, Math.ceil(durationMins / slotDuration));
      const startIndex = timeToIndex(startStr);
      if (startIndex === -1) return;
      for (let i = 0; i < slotsToOccupy; i++) {
        const idx = startIndex + i;
        if (idx < rawTimeSlots.length) occupied.add(rawTimeSlots[idx]);
      }
    });
    return occupied;
  }, [bookingsByDate, date, rawTimeSlots, slotDuration, timeToIndex]);

  // Compute fully booked dates (no free slot available)
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
        const startIndex = timeToIndex(startStr);
        if (startIndex === -1) return;
        for (let i = 0; i < slotsToOccupy; i++) {
          const idx = startIndex + i;
          if (idx < rawTimeSlots.length) occupied.add(rawTimeSlots[idx]);
        }
      });
      // If occupied covers all raw slots (we will still consider lunch movement in availability check)
      if (occupied.size >= rawTimeSlots.length) set.add(key);
    });
    return set;
  }, [bookingsByDate, rawTimeSlots, slotDuration, timeToIndex]);

  const availableDates = availability.map((a) => new Date(a.date));

  const isTodayOrTomorrow = (checkDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const d = new Date(checkDate);
    d.setHours(0, 0, 0, 0);

    return d.getTime() === today.getTime() || d.getTime() === tomorrow.getTime();
  };

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
    if (isTodayOrTomorrow(date)) return false;

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

    if (fullyBookedDates.has(key)) return false;
    // Also selection must be in computedOptimalSlots (see below)
    return true;
  }, [date, availability, fullyBookedDates, isDateAvailable]);

  // Helper: create a boolean array representing occupancy for a given date from existing bookings
  const occupancyArrayForDate = React.useCallback(
    (checkDate: Date): boolean[] => {
      const arr = Array(rawTimeSlots.length).fill(false);
      const d = new Date(checkDate);
      d.setHours(0, 0, 0, 0);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      const list = bookingsByDate.get(key) || [];
      list.forEach((b) => {
        const start = new Date(b.date_and_time);
        const hh = start.getHours().toString().padStart(2, "0");
        const mm = start.getMinutes().toString().padStart(2, "0");
        const startStr = `${hh}:${mm}`;
        let durationMins = (b.total_duration as any) || slotDuration;
        if (!durationMins || typeof durationMins !== "number") durationMins = slotDuration;
        const slotsToOccupy = Math.max(1, Math.ceil(durationMins / slotDuration));
        const startIndex = timeToIndex(startStr);
        if (startIndex === -1) return;
        for (let i = 0; i < slotsToOccupy; i++) {
          const idx = startIndex + i;
          if (idx < arr.length) arr[idx] = true;
        }
      });
      return arr;
    },
    [bookingsByDate, rawTimeSlots.length, slotDuration, timeToIndex]
  );

  /**
   * computeOptimalSlots
   *
   * Strategy:
   * - For each candidate start slot i:
   *    - compute required slots = ceil(desiredDuration / slotDuration)
   *    - candidate must fit within day
   *    - For each lunch option (ordered by closeness to default 13:00):
   *        - lunch must not overlap existing bookings (we can move lunch only if it's free)
   *        - candidate must not overlap existing bookings
   *        - if candidate overlaps the default lunch, but lunch can move to this option (and that option doesn't overlap bookings), accept
   *    - For accepted candidates compute leftGap = free slots between previous occupied slot (or start of day) and this start
   * - Sort accepted candidates by (leftGap asc, startIndex asc) to prefer early and left-packed starts
   * - Return the start times as strings
   */
  const computeOptimalSlots = React.useCallback(
    (checkDate: Date | undefined, desiredMins: number): string[] => {
      if (!checkDate) return [];
      if (!isDateAvailable(checkDate)) return [];

      // get occupancy of existing bookings
      const occupancy = occupancyArrayForDate(checkDate); // boolean[]
      const slotsNeeded = Math.max(1, Math.ceil(desiredMins / slotDuration));
      const candidates: { startIndex: number; leftGap: number; lunchStartMins: number }[] = [];

      // sort lunch options by closeness to default 13:00 and prefer earlier when tie
      const lunchSorted = [...lunchStarts].sort((a, b) => {
        const center = lunchDefaultStartHour * 60;
        const da = Math.abs(a - center);
        const db = Math.abs(b - center);
        if (da !== db) return da - db;
        return a - b;
      });

      // helper: convert lunchStart (minutes from midnight) to slot indices it occupies
      const lunchSlotsForStart = (lunchStartMins: number) => {
        // lunch covers [lunchStartMins, lunchStartMins + lunchDurationMins)
        const lunchStartIndex = Math.floor(((lunchStartMins - startHour * 60) / slotDuration));
        const lunchSlots = [];
        const lunchSlotsCount = Math.max(1, Math.ceil(lunchDurationMins / slotDuration));
        for (let i = 0; i < lunchSlotsCount; i++) {
          const idx = lunchStartIndex + i;
          if (idx >= 0 && idx < rawTimeSlots.length) lunchSlots.push(idx);
        }
        return lunchSlots;
      };

      // Precompute the index of last occupied slot before each index (for leftGap computation)
      const lastOccupiedBeforeIndex = (index: number) => {
        for (let i = index - 1; i >= 0; i--) {
          if (occupancy[i]) return i;
        }
        return -1;
      };

      // Try each candidate start index
      for (let startIndex = 0; startIndex < rawTimeSlots.length; startIndex++) {
        const endIndexExclusive = startIndex + slotsNeeded;
        if (endIndexExclusive > rawTimeSlots.length) break; // doesn't fit in day

        // If any of the required slots overlap an existing booking -> cannot place here regardless
        let overlapsExistingBooking = false;
        for (let si = startIndex; si < endIndexExclusive; si++) {
          if (occupancy[si]) {
            overlapsExistingBooking = true;
            break;
          }
        }
        if (overlapsExistingBooking) continue;

        // For each lunch option, check if lunch can be placed so candidate doesn't overlap lunch,
        // and lunch itself does not overlap existing bookings
        let foundLunchOption: number | null = null;
        for (const lunchStartMins of lunchSorted) {
          const lunchSlotIndices = lunchSlotsForStart(lunchStartMins);
          // If lunch falls entirely outside work range (no overlapping indices), it's invalid for our day
          if (lunchSlotIndices.length === 0) continue;

          // Does this lunch overlap any existing booking?
          let lunchOverlapsBooking = false;
          for (const li of lunchSlotIndices) {
            if (occupancy[li]) {
              lunchOverlapsBooking = true;
              break;
            }
          }
          if (lunchOverlapsBooking) continue; // can't move lunch here

          // Does candidate overlap lunch?
          let candidateOverlapsLunch = false;
          for (let si = startIndex; si < endIndexExclusive; si++) {
            if (lunchSlotIndices.includes(si)) {
              candidateOverlapsLunch = true;
              break;
            }
          }
          // If candidate overlaps lunch, but we chose this lunch option intentionally to avoid overlapping with default lunch,
          // then candidateOverlapsLunch must be false. If it is true, candidate cannot be scheduled with this lunch option.
          if (candidateOverlapsLunch) continue;

          // If we reached here, candidate fits and lunch can be moved to lunchStartMins without conflict
          foundLunchOption = lunchStartMins;
          break;
        }

        if (foundLunchOption === null) {
          // No lunch placement makes this candidate valid (either because lunch always collides with bookings or candidate collides with all valid lunches)
          continue;
        }

        // Compute leftGap: distance (in slots) from last occupied slot (or day start) to this candidate
        const lastOcc = lastOccupiedBeforeIndex(startIndex);
        const leftGap = lastOcc === -1 ? startIndex : startIndex - (lastOcc + 1);
        candidates.push({ startIndex, leftGap, lunchStartMins: foundLunchOption });
      }

      // Sort candidates: prefer smallest leftGap (minimize downtime) then earliest startIndex (leave earlier)
      candidates.sort((a, b) => {
        if (a.leftGap !== b.leftGap) return a.leftGap - b.leftGap;
        return a.startIndex - b.startIndex;
      });

      // Map to time strings and ensure uniqueness
      const result: string[] = [];
      const seen = new Set<number>();
      for (const c of candidates) {
        if (!seen.has(c.startIndex)) {
          seen.add(c.startIndex);
          result.push(rawTimeSlots[c.startIndex]);
        }
      }
      return result;
    },
    [
      rawTimeSlots,
      lunchStarts,
      slotDuration,
      lunchDurationMins,
      lunchDefaultStartHour,
      startHour,
      occupancyArrayForDate,
    ]
  );

  // Compute optimized start times for the selected date
  const optimizedStartTimes = React.useMemo(() => {
    return computeOptimalSlots(date, desiredDuration || slotDuration);
  }, [date, desiredDuration, computeOptimalSlots]);
  
  // If selectedTime becomes invalid (not in optimizedStartTimes), clear it
  React.useEffect(() => {
    if (selectedTime && !optimizedStartTimes.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [selectedTime, optimizedStartTimes]);

  // track previous validity and datetime to avoid repeatedly calling parent callbacks
  const prevIsValidRef = React.useRef<boolean | null>(null);
  const prevCombinedRef = React.useRef<Date | null>(null);

  // Notify parent about selection validity and send datetime only when values actually change
  React.useEffect(() => {
    const isValidFinal = !!(
      date &&
      selectedTime &&
      isSelectionValid &&
      optimizedStartTimes.includes(selectedTime)
    );

    // Only notify parent if validity changed
    if (prevIsValidRef.current !== isValidFinal) {
      onAvailabilityChange?.(isValidFinal);
      prevIsValidRef.current = isValidFinal;
    }

    if (!isValidFinal) {
      // If previously there was a combined datetime, clear it
      if (prevCombinedRef.current !== null) prevCombinedRef.current = null;
      onDateTimeChange?.(null);
      return;
    }

    const [h, m] = selectedTime!.split(":").map(Number);
    const combined = new Date(date!);
    combined.setHours(h, m, 0, 0);

    // Only call onDateTimeChange when the combined datetime actually changed
    if (!prevCombinedRef.current || prevCombinedRef.current.getTime() !== combined.getTime()) {
      onDateTimeChange?.(combined);
      prevCombinedRef.current = combined;
    }
  }, [date, selectedTime, isSelectionValid, optimizedStartTimes, onAvailabilityChange, onDateTimeChange]);

  const disabledMatcher = (checkDate: Date) => {
    // Block today and tomorrow
    if (isTodayOrTomorrow(checkDate)) return true;

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
            {optimizedStartTimes.length === 0 ? (
              <div className="text-sm text-muted-foreground">Ingen ledige tidspunkter for denne dag.</div>
            ) : (
              optimizedStartTimes.map((time) => {
                const isOccupied = occupiedTimesForSelectedDate.has(time);
                const isDateAvail = date ? isDateAvailable(date) : false;
                // The optimizedStartTimes already respect bookings & lunch, but keep double-check
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
              })
            )}
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
