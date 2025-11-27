import React, { useState, useCallback } from "react";
import { Calendar20 } from "@/components/ui/calendar-time-slots";
import { BookingFormData } from "@/app/(public)/booking/_components/Form";

interface DatePickerProps {
  formData: BookingFormData;
  currentDate: Date | null;       // New prop: Controlled date
  estimatedDuration: number;      // New prop: Pre-calculated duration
  onDateChange: (date: Date | null) => void; // New prop: Direct date handler
  onAvailabilityChange: (available: boolean) => void;
}

// Wrap in React.memo to prevent re-renders if props haven't changed
export const DatePicker = React.memo(function DatePicker({
  formData,
  currentDate,
  estimatedDuration,
  onDateChange,
  onAvailabilityChange,
}: DatePickerProps) {
  
  // Local check for UI
  const [isSelectionAvailable, setIsSelectionAvailable] = useState(false);

  // Simple handler that just forwards the date to the parent
  const handleDateTimeChange = useCallback((dateTime: Date | null) => {
    onDateChange(dateTime);
  }, [onDateChange]);

  const handleAvailabilityChange = useCallback((available: boolean) => {
    setIsSelectionAvailable(available);
    onAvailabilityChange(available);
  }, [onAvailabilityChange]);

  return (
    <div className="rounded-xl border-2 border-black p-6 md:p-8 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">5. Vælg dato for booking</h2>
        
        <div className="group relative">
          <button
            type="button"
            aria-label="Calendar info"
            className="p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-slate-700"
            >
              <path
                fillRule="evenodd"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM11 10.75c0-.414.336-.75.75-.75h.5c.414 0 .75.336.75.75v4.5c0 .414-.336.75-.75.75h-.5a.75.75 0 01-.75-.75v-4.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          <div
            className="pointer-events-none absolute right-0 top-full mt-2 w-72 rounded-lg bg-white border border-slate-200 shadow-xl p-4 text-sm text-slate-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 scale-95 group-hover:scale-100 transform transition-all duration-200 z-50 leading-relaxed"
          >
            Hvis der ikke er nogen ledige tider på den valgte dato, betyder det at din booking er for lang. 
            <br /><br />
            Hvis du ønsker at booke flere store tatoveringer, anbefaler vi at du fordeler dem over flere bookinger.
          </div>
        </div>
      </div>

      <Calendar20
        // We might need to ensure Calendar20 respects the controlled value
        // usually standard calendars take a 'selected' prop. 
        // If Calendar20 is custom, ensure it syncs with 'onDateTimeChange'.
        onDateTimeChange={handleDateTimeChange}
        desiredDuration={estimatedDuration}
        onAvailabilityChange={handleAvailabilityChange}
      />
    </div>
  );
});