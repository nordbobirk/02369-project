import { Calendar20 } from "@/components/ui/calendar-time-slots";
import { BookingFormData } from "./Form";

export function DatePicker({
  formData,
  handleInputChange,
}: {
  formData: BookingFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  const handleDateTimeChange = (dateTime: Date | null) => {
    handleInputChange({
      target: {
        name: "dateTime",
        value: dateTime,
      },
    } as any);
  };

  return (
    <div className="rounded-xl border-2 border-black p-8">
      <h2 className="text-2xl font-bold mb-6">5. Vælg dato for booking</h2>
      <Calendar20 onDateTimeChange={handleDateTimeChange} />
    </div>
  );
}