"use client";

import React, { useState, useEffect } from "react";
import { getAvailability, toggleAvailability } from "./availabilityClient";

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [originalAvailability, setOriginalAvailability] = useState<Record<string, boolean>>({});
  const [changedDates, setChangedDates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchedDate, setLastTouchedDate] = useState<string | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  
  const monthNames = [
    "januar","februar","marts","april","maj","juni",
    "juli","august","september","oktober","november","december"
  ];
  const weekdays = ["ma","ti","on","to","fr","lø","sø"];


  /** SAFE DATE FORMATTER */
  function toLocalISO(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }


  /** CALENDAR SETUP */
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startingDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);


  /** LOAD AVAILABILITY */
  useEffect(() => {
    async function load() {
      setLoading(true);

      const raw = await getAvailability();

      const map: Record<string, boolean> = {};

      // Default for all days in this month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = toLocalISO(new Date(year, month, day));
        map[date] = false;
      }

      // Override with Supabase data
      raw.forEach((row: any) => {
        map[row.date] = row.is_open;
      });

      setAvailability(map);
      setOriginalAvailability(map);
      setLoading(false);
    }

    load();
  }, [currentDate]);


  /** TOGGLE (WITHOUT SAVING) */
  function toggleLocal(date: string) {
    setAvailability((prev) => {
      const updated = { ...prev, [date]: !prev[date] };
      const original = originalAvailability[date];

      // Track changes
      if (updated[date] !== original) {
        setChangedDates((prev) => ({ ...prev, [date]: updated[date] }));
      } else {
        setChangedDates((prev) => {
          const copy = { ...prev };
          delete copy[date];
          return copy;
        });
      }

      return updated;
    });
  }


  /** iPHONE-STYLE SWIPE SELECTION */
  function handleSwipeMove(clientX: number, clientY: number) {
    if (!isDragging) return;

    const target = document.elementFromPoint(clientX, clientY);
    if (!target) return;

    if (target instanceof HTMLElement && target.dataset.date) {
      const date = target.dataset.date;

      if (date !== lastTouchedDate) {
        toggleLocal(date);
        setLastTouchedDate(date);
      }
    }
  }


  function handleMouseDown(date: string) {
    setIsDragging(true);
    setLastTouchedDate(date);
    toggleLocal(date);
  }

  function handleMouseUp() {
    setIsDragging(false);
    setLastTouchedDate(null);
  }


  /** SAVE CHANGES */
  async function saveChanges() {
    const entries = Object.entries(changedDates);

    await Promise.all(
      entries.map(([date, isOpen]) => toggleAvailability(date, isOpen))
    );

    const updated = { ...originalAvailability };
    entries.forEach(([date, isOpen]) => (updated[date] = isOpen));

    setOriginalAvailability(updated);
    setChangedDates({});
    setShowSavedMessage(true);

    setTimeout(() => setShowSavedMessage(false), 3000);
  }


  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));


  return (
    <>
      {/* MAIN PAGE CARD */}
      <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl shadow-inner select-none">

        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Vælg din tilgængelighed</h2>


        {loading ? (
          <p className="text-gray-500">Indlæser kalender...</p>
        ) : (
          <>
            {/* WHITE CALENDAR BOX */}
            <div
              className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* HEADER */}
              <div className="bg-rose-300 flex items-center justify-between px-4 py-3 text-lg font-semibold text-gray-800 capitalize">
                <button onClick={previousMonth}>‹</button>
                <span>{monthNames[month]} {year}</span>
                <button onClick={nextMonth}>›</button>
              </div>

              {/* WEEKDAYS */}
              <div className="grid grid-cols-7 text-center bg-gray-100 text-gray-600 font-medium">
                {weekdays.map((w) => (
                  <div key={w} className="py-2">{w}</div>
                ))}
              </div>

              {/* DAYS GRID */}
              <div className="grid grid-cols-7 p-2 text-center">
                {Array.from({ length: startingDay }).map((_, i) => (
                  <div key={i} />
                ))}

                {daysArray.map((day) => {
                  const dateString = toLocalISO(new Date(year, month, day));
                  const isOpen = availability[dateString];

                  return (
                    <button
                      key={day}
                      data-date={dateString}
                      onMouseDown={() => handleMouseDown(dateString)}
                      onMouseMove={(e) => handleSwipeMove(e.clientX, e.clientY)}
                      onTouchStart={() => handleMouseDown(dateString)}
                      onTouchMove={(e) => {
                        const t = e.touches[0];
                        handleSwipeMove(t.clientX, t.clientY);
                      }}
                      onTouchEnd={handleMouseUp}
                      className={`m-1 rounded-md flex items-center justify-center h-12 text-sm font-medium 
                        ${isOpen ? "bg-rose-300 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>


            {/* SAVE BUTTON + LIST */}
            {Object.keys(changedDates).length > 0 && (
              <div className="mt-4 w-full max-w-md">
                <button
                  onClick={saveChanges}
                  className="w-full bg-rose-400 text-white py-3 rounded-xl shadow hover:bg-rose-500 text-lg font-semibold"
                >
                  Gem ændringer
                </button>

                <div className="mt-3 bg-white p-3 rounded-xl shadow">
                  <p className="font-semibold text-gray-700 mb-2">Ændrede datoer:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {Object.entries(changedDates).map(([date, open]) => (
                      <li key={date}>
                        {date} → {open ? "Åben" : "Lukket"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>


      {/* SUCCESS MESSAGE OUTSIDE THE CARD */}
      {showSavedMessage && (
        <div className="mt-10 text-center">
          <p className="text-rose-400 text-lg font-semibold">
            Ændringerne er nu gemt!
          </p>
        </div>
      )}
    </>
  );
}
