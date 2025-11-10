"use client";

import React, { useState, useEffect } from "react";
import { getAvailability, toggleAvailability } from "./availabilityAction";

export default function Tilgængelighed() {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);

  const monthNames = [
    "januar",
    "februar",
    "marts",
    "april",
    "maj",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "december",
  ];
  const weekdays = ["ma", "ti", "on", "to", "fr", "lø", "sø"];

  // get availability from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getAvailability();
      const map: Record<string, boolean> = {};
      data.forEach((d: any) => {
        map[d.date] = d.is_open;
      });
      setAvailability(map);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Toggle a single day
  async function handleToggle(date: string) {
    const newState = !availability[date];
    setAvailability((prev) => ({ ...prev, [date]: newState }));
    await toggleAvailability(date, newState);
    console.log(`✅ Updated: ${date} → ${newState ? "ÅBEN" : "LUKKET"}`);
  }

  // Swipe / drag support
  function handleMouseDown(date: string) {
    setIsDragging(true);
    handleToggle(date);
  }
  function handleMouseEnter(date: string) {
    if (isDragging) handleToggle(date);
  }
  function handleMouseUp() {
    setIsDragging(false);
  }

  //  Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startingDay = (firstDay.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Mass actions (open / close entire month)
  async function openAllMonth() {
    const updated = { ...availability };
    const updates = daysArray.map((day) => {
      const dateString = new Date(year, month, day).toLocaleDateString("sv-SE");
      updated[dateString] = true;
      return toggleAvailability(dateString, true);
    });
    await Promise.all(updates);
    setAvailability(updated);
  }

  async function closeAllMonth() {
    const updated = { ...availability };
    const updates = daysArray.map((day) => {
      const dateString = new Date(year, month, day).toLocaleDateString("sv-SE");
      updated[dateString] = false;
      return toggleAvailability(dateString, false);
    });
    await Promise.all(updates);
    setAvailability(updated);
  }

  // Rigtig dato
  function getLocalDateString(year: number, month: number, day: number) {
    return new Date(year, month, day).toLocaleDateString("sv-SE");
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl shadow-inner select-none">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
        Vælg din tilgængelighed
      </h2>

      {loading ? (
        <p className="text-gray-500">Indlæser kalender...</p>
      ) : (
        <div
          className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Month header */}
          <div className="bg-pink-300 flex items-center justify-between px-4 py-3 text-lg font-semibold text-gray-800 capitalize">
            <button
              onClick={previousMonth}
              className="text-gray-800 hover:text-gray-900 text-2xl"
            >
              ‹
            </button>
            <span>
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="text-gray-800 hover:text-gray-900 text-2xl"
            >
              ›
            </button>
          </div>

          {/*  Bulk buttons */}
          <div className="flex justify-between px-4 py-2 text-sm bg-gray-50 border-b">
            <button
              onClick={openAllMonth}
              className="text-green-600 font-medium hover:underline"
            >
              
            
            </button>
          </div>

          {/* Weekdays header */}
          <div className="grid grid-cols-7 text-center font-medium text-sm text-gray-600 bg-gray-100 mt-1">
            {weekdays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div
            className="grid grid-cols-7 text-center text-sm sm:text-base p-2"
            style={{ gridAutoRows: "minmax(50px, auto)" }}
          >
            {/* Empty slots before 1st */}
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days */}
            {daysArray.map((day) => {
              const dateString = getLocalDateString(year, month, day);
              const isOpen = availability[dateString];

              return (
                <button
                  key={day}
                  data-date={dateString}
                  onMouseDown={() => handleMouseDown(dateString)}
                  onMouseEnter={() => handleMouseEnter(dateString)}
                  onTouchStart={() => handleMouseDown(dateString)}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const target = document.elementFromPoint(
                      touch.clientX,
                      touch.clientY
                    );
                    if (target && target instanceof HTMLElement) {
                      const date = target.dataset.date;
                      if (date) handleToggle(date);
                    }
                  }}
                  onTouchEnd={handleMouseUp}
                  className={`m-1 rounded-md flex items-center justify-center transition-all font-medium
                    ${
                      isOpen
                        ? "bg-pink-400 text-white hover:bg-pink-500"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  style={{ height: "50px" }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <p className="text-gray-400 text-xs text-center mb-4">
            Tryk eller træk for at åbne/lukke dage
          </p>
        </div>
      )}
    </div>
  );
}
