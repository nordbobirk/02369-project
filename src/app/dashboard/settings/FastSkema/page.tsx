"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { initBrowserClient } from "@/lib/supabase/client";
import { getAvailability } from "../availability/availabilityClient";

export default function FastSkema() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  function toLocalISO(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const [weekStart, setWeekStart] = useState<Date | null>(null);

  function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function formatDisplayDate(date: Date) {
    return date.toLocaleDateString("da-DK", {
      day: "2-digit",
      month: "short",
    });
  }

  useEffect(() => {
    setWeekStart(getMonday(new Date()));
  }, []);

  const nextWeek = () =>
    weekStart && setWeekStart(new Date(weekStart.getTime() + 7 * 86400000));
  const prevWeek = () =>
    weekStart && setWeekStart(new Date(weekStart.getTime() - 7 * 86400000));

  const days = ["Man", "Tir", "Ons", "Tors", "Fre", "Lør", "Søn"];
  const hours = Array.from({ length: 9 }, (_, i) => i + 8);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const supabase = initBrowserClient();

      const { data: bookingData } = await supabase
        .from("bookings")
        .select("id, name, date_and_time, status")
        .eq("status", "confirmed");

      const avail = await getAvailability();

      const map: Record<string, boolean> = {};
      avail.forEach((a: any) => {
        map[a.date] = a.is_open;
      });

      setBookings(bookingData || []);
      setAvailability(map);
      setLoading(false);
    }
    load();
  }, []);

  if (!weekStart) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Indlæser...</p>
      </div>
    );
  }

  const weekRange = `${formatDisplayDate(weekStart)} – ${formatDisplayDate(
    new Date(weekStart.getTime() + 6 * 86400000)
  )}`;

  return (
    <div className="w-full bg-white p-3 sm:p-6 rounded-2xl flex flex-col text-center">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">Fast skema</h2>

      <div className="flex flex-col items-center gap-2 mb-3 text-sm sm:text-base">

  {/* Row with the two buttons */}
  <div className="flex w-full justify-between">
    <Button className="bg-rose-300 hover:bg-rose-400 px-3 py-1 text-xs sm:text-sm"
      onClick={prevWeek}
    >
      ← Forrige uge
    </Button>

    <Button className="bg-rose-300 hover:bg-rose-400 px-3 py-1 text-xs sm:text-sm"
      onClick={nextWeek}
    >
      Næste uge →
    </Button>
  </div>

  {/* Date BELOW the buttons */}
  <p className="text-gray-600 text-xs sm:text-sm text-center">
    {weekRange}
  </p>
</div>


      {loading ? (
        <p className="text-gray-500">Indlæser bookinger...</p>
      ) : (
        <div className="w-full overflow-hidden">
          <div className="w-full grid grid-cols-[45px_repeat(7,minmax(0,1fr))] border-t border-l text-[9px] sm:text-xs">
            
            {/* Empty top-left cell */}
            <div className="border-b border-r bg-[#f3f4f6] h-8"></div>

            {/* Day headers */}
            {days.map((day, i) => {
              const d = new Date(weekStart);
              d.setDate(weekStart.getDate() + i);
              return (
                <div
                  key={i}
                  className="border-b border-r bg-[#f3f4f6] py-2 font-semibold text-center"
                >
                  <div>{day}</div>
                  <div className="text-gray-500 text-[10px] sm:text-xs">
                    {formatDisplayDate(d)}
                  </div>
                </div>
              );
            })}

            {/* Hour rows */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                
                {/* Hour label */}
                <div className="border-b border-r text-gray-600 h-10 flex items-center justify-center bg-gray-50">
                  {hour}:00
                </div>

                {/* Cells */}
                {days.map((_, i) => {
                  const d = new Date(weekStart);
                  d.setDate(weekStart.getDate() + i);

                  const dateString = toLocalISO(d);
                  const isOpen = availability[dateString];

                  const bookingsForSlot = bookings.filter((b) => {
                    const bd = new Date(b.date_and_time);
                    return (
                      bd.getFullYear() === d.getFullYear() &&
                      bd.getMonth() === d.getMonth() &&
                      bd.getDate() === d.getDate() &&
                      bd.getHours() === hour
                    );
                  });

                  // Lunch
                  if (hour === 13 && isOpen) {
                    return (
  <div
    key={`${dateString}-lunch`}
    className="border-b border-r bg-rose-300 flex items-center justify-center w-full h-full"
  >
    <span className="text-white text-[6px] sm:text-xs font-small">
      Frokost
    </span>
  </div>
);

                  }

                  // Closed
                  if (!isOpen) {
                    return (
                      <div
                        key={`${dateString}-${hour}`}
                        className="border-b border-r bg-gray-100 flex items-center justify-center"
                      >
                        <span className="text-gray-400 text-[10px]">Lukket</span>
                      </div>
                    );
                  }

                  // Open day cell – ✔ updated booking layout
                  return (
                    <div
                      key={`${dateString}-${hour}`}
                      className="border-b border-r h-10 flex flex-col justify-center items-center overflow-hidden gap-0.5"
                    >
                      {bookingsForSlot.length > 0 ? (
                        bookingsForSlot.map((b) => (
                          <div
                            key={b.id}
                            className="bg-rose-200 text-black-800 text-[8px] px-2 py-[2px] rounded w-full text-center"
                          >
                            {b.name}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-300 text-[10px]">–</span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
