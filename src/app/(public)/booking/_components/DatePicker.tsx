import { Calendar20 } from "@/components/ui/calendar-time-slots";
import { BookingFormData, estimateTime } from "./Form";
import { useState, useCallback } from "react";

export function DatePicker({
  formData,
  handleInputChange,
  onAvailabilityChange,
}: {
  formData: BookingFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onAvailabilityChange: (available: boolean) => void;
}) {
  const [isSelectionAvailable, setIsSelectionAvailable] = useState(false);
  const handleDateTimeChange = useCallback((dateTime: Date | null) => {
    handleInputChange({
      target: {
        name: "dateTime",
        value: dateTime,
      },
    } as any);
  }, [handleInputChange]);

  const handleAvailabilityChange = useCallback((available: boolean) => {
    setIsSelectionAvailable(available);
    onAvailabilityChange(available);
  }, [onAvailabilityChange]);



  return (
    <div className="rounded-xl border-2 border-black p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">5. Vælg dato for booking</h2>
        <div className="group relative">
          <button
            type="button"
            aria-label="Calendar info"
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-slate-700"
            >
              <path
                fillRule="evenodd"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM11 10.75c0-.414.336-.75.75-.75h.5c.414 0 .75.336.75.75v4.5c0 .414-.336.75-.75.75h-.5a.75.75 0 01-.75-.75v-4.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div
            className="pointer-events-none absolute right-0 top-full mt-2 w-64 rounded-md bg-white border shadow-md p-3 text-sm text-slate-700 invisible group-hover:visible scale-95 group-hover:scale-100 transform transition-all z-50"
            style={{
              backgroundColor: "#ffffff",
              mixBlendMode: "normal",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
            }}
          >
            Hvis der ikke er nogen ledige tider på den valgte dato, så betyder det at din booking er for lang. Hvis 
            du ønsker at booke flere store tatoveringer, så anbefaler vi at du fordeler dem over flere bookinger.
          </div>
        </div>
      </div>
      <Calendar20
        onDateTimeChange={handleDateTimeChange}
        desiredDuration={estimateTime(formData)}
        onAvailabilityChange={handleAvailabilityChange}
      />
    </div>
  );
}