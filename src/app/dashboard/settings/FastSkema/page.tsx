"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { initBrowserClient } from "@/lib/supabase/client";
import { getAvailability } from "../availability/availabilityClient";

export default function FastSkema() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // IMPORTANT: initialize later to prevent hydration mismatch
  const [weekStart, setWeekStart] = useState<Date | null>(null);

  // --- helper: get the Monday of a given week ---
  function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // --- helper: consistent, local date format (dd.mm) ---
  function formatDisplayDate(date: Date) {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${d}.${m}`;
  }

  // --- helper: consistent ISO date WITHOUT timezone issues ---
  function toLocalISO(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Delay date calculation until after hydration
  useEffect(() => {
    setWeekStart(getMonday(new Date()));
  }, []);

  // Week switching
  const nextWeek = () =>
    weekStart && setWeekStart(new Date(weekStart.getTime() + 7 * 86400000));
  const prevWeek = () =>
    weekStart && setWeekStart(new Date(weekStart.getTime() - 7 * 86400000));

  const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
  const hours = Array.from({ length: 9 }, (_, i) => i + 8); // 8:00–16:00

  // Load data
  useEffect(() => {
    async function fetchData() {
      const supabase = initBrowserClient();
      setLoading(true);

      const { data: bookingData } = await supabase
        .from("bookings")
        .select("id, name, date_and_time, status")
        .eq("status", "confirmed");

      const availData = await getAvailability();

      const openMap: Record<string, boolean> = {};
      availData.forEach((a: any) => {
        openMap[a.date] = a.is_open;
      });

      setBookings(bookingData || []);
      setAvailability(openMap);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Wait until weekStart exists
  if (!weekStart) {
    return (
      <div className="w-full bg-white p-6 rounded-2xl flex flex-col text-center">
        <p className="text-gray-500">Indlæser...</p>
      </div>
    );
  }

  const weekRange = `${formatDisplayDate(weekStart)} – ${formatDisplayDate(
    new Date(weekStart.getTime() + 6 * 86400000)
  )}`;

  return (
    <div className="w-full bg-white p-6 rounded-2xl flex flex-col text-center">
      <h2 className="text-2xl font-semibold mb-4">Fast skema</h2>

      <div className="flex justify-between mb-4">
        <Button className="bg-rose-300 hover:bg-rose-400" onClick={prevWeek}>
          ← Forrige uge
        </Button>
        <p className="self-center text-gray-600">{weekRange}</p>
        <Button className="bg-rose-300 hover:bg-rose-400" onClick={nextWeek}>
          Næste uge →
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Indlæser bookinger...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] border-t border-l">
            {/* Header Row */}
            <div className="border-b border-r bg-gray-100"></div>
            {days.map((day, i) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + i);
              return (
                <div key={i} className="border-b border-r bg-gray-100 py-2 font-semibold text-sm">
                  <div>{day}</div>
                  <div className="text-xs text-gray-500">{formatDisplayDate(date)}</div>
                </div>
              );
            })}

            {/* Time Rows */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="border-b border-r text-sm text-gray-500 py-4 px-2 bg-gray-50">
                  {hour}:00
                </div>

                {days.map((_, i) => {
                  const cellDate = new Date(weekStart);
                  cellDate.setDate(weekStart.getDate() + i);

                  const dateString = toLocalISO(cellDate); // SAFE

                  const isOpen = availability[dateString];
                  const bookingsForSlot = bookings.filter((b) => {
                    const d = new Date(b.date_and_time);
                    return (
                      d.getFullYear() === cellDate.getFullYear() &&
                      d.getMonth() === cellDate.getMonth() &&
                      d.getDate() === cellDate.getDate() &&
                      d.getHours() === hour
                    );
                  });

                  // Lunch break
                  if (hour === 13)
                    return (
                      <div
                        key={`${dateString}-frokost`}
                        className="border-b border-r bg-rose-50 flex items-center justify-center"
                      >
                        <span className="bg-rose-300 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                          Frokost
                        </span>
                      </div>
                    );

                  // Closed days
                  if (!isOpen)
                    return (
                      <div
                        key={`${dateString}-${hour}`}
                        className="border-b border-r bg-gray-100 flex items-center justify-center"
                      >
                        <span className="text-gray-400 text-xs">Lukket</span>
                      </div>
                    );

                  // Open days
                  return (
                    <div
                      key={`${dateString}-${hour}`}
                      className="border-b border-r h-16 flex flex-col justify-center items-center"
                    >
                      {bookingsForSlot.length > 0 ? (
                        bookingsForSlot.map((b) => (
                          <div
                            key={b.id}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md shadow-sm"
                          >
                            {b.name}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-300 text-xs">–</span>
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
