"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { initBrowserClient } from "@/lib/supabase/client";
import { getAvailability } from "../availability/availabilityClient";

export default function FastSkema() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Safe date formatter
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
      weekday: "long",
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

  const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
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
    <div className="w-full bg-white p-6 rounded-2xl flex flex-col text-center">
      <h2 className="text-2xl font-semibold mb-4">Fast skema</h2>

      <div className="flex justify-between mb-4">
        <Button onClick={prevWeek} className="bg-rose-300 hover:bg-rose-400">
          ← Forrige uge
        </Button>

        <p className="self-center text-gray-600">{weekRange}</p>

        <Button onClick={nextWeek} className="bg-rose-300 hover:bg-rose-400">
          Næste uge →
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Indlæser bookinger...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] border-t border-l">

            {/* Header */}
            <div className="border-b border-r bg-gray-100"></div>
            {days.map((day, i) => {
              const d = new Date(weekStart);
              d.setDate(weekStart.getDate() + i);
              return (
                <div key={i} className="border-b border-r bg-gray-100 py-2 font-semibold text-sm">
                  <div>{day}</div>
                  <div className="text-xs text-gray-500">{formatDisplayDate(d)}</div>
                </div>
              );
            })}

            {/* Hours */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="border-b border-r text-sm text-gray-500 py-4 px-2 bg-gray-50">
                  {hour}:00
                </div>

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
                        key={`${dateString}-frokost`}
                        className="border-b border-r bg-rose-50 flex items-center justify-center"
                      >
                        <span className="bg-rose-300 text-white px-3 py-1 rounded-lg text-xs">
                          Frokost
                        </span>
                      </div>
                    );
                  }

                  // Closed day
                  if (!isOpen) {
                    return (
                      <div
                        key={`${dateString}-${hour}`}
                        className="border-b border-r bg-gray-100 flex items-center justify-center"
                      >
                        <span className="text-gray-400 text-xs">Lukket</span>
                      </div>
                    );
                  }

                  // Open day
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
