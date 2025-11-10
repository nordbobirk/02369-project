"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { initBrowserClient } from "@/lib/supabase/client";
import { getAvailability } from "./availabilityAction";

export default function FastSkema() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));

  const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
  const hours = Array.from({ length: 9 }, (_, i) => i + 8); // 8:00 - 16:00

  function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  const nextWeek = () => setWeekStart(new Date(weekStart.getTime() + 7 * 86400000));
  const prevWeek = () => setWeekStart(new Date(weekStart.getTime() - 7 * 86400000));

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = initBrowserClient();

      // Get confirmed bookings
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("id, name, date_and_time, status")
        .eq("status", "confirmed");

      //  Get open days
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

  const weekRange = `${weekStart.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  })} – ${new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  })}`;

  return (
    <div className="w-full bg-gray-50 p-6 rounded-2xl shadow-inner flex flex-col text-center">
      <h2 className="text-2xl font-semibold mb-4">Fast skema</h2>

      <div className="flex justify-between mb-4">
        <Button className="bg-pink-300 hover:bg-pink-400" onClick={prevWeek}>← Forrige uge</Button>
        <p className="self-center text-gray-600">{weekRange}</p>
        <Button className="bg-pink-300 hover:bg-pink-400" onClick={nextWeek}>Næste uge →</Button>
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
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString("da-DK", { day: "numeric", month: "short" })}
                  </div>
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
                  const dateString = cellDate.toISOString().split("T")[0];

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

                  // Frokostpause (13:00–14:00)
                  if (hour === 13)
                    return (
                      <div key={`${dateString}-frokost`} className="border-b border-r bg-pink-50 flex items-center justify-center">
                        <span className="bg-pink-300 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold">
                          Frokost
                        </span>
                      </div>
                    );

                  // Closed days
                  if (!isOpen)
                    return (
                      <div key={`${dateString}-${hour}`} className="border-b border-r bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Lukket</span>
                      </div>
                    );

                  //  open days
                  return (
                    <div key={`${dateString}-${hour}`} className="border-b border-r h-16 flex flex-col justify-center items-center">
                      {bookingsForSlot.length > 0 ? (
                        bookingsForSlot.map((b) => (
                          <div key={b.id} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md shadow-sm">
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
