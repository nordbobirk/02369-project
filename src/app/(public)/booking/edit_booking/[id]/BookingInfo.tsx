'use client'

import CancelBooking from "@/app/(public)/booking/edit_booking/[id]/CancelBooking";

// Helper Function for User-Friendly Status Display 
const getStatusDisplay = (status: string) => {
    switch (status) {
        case "pending":
            return { text: "Afventer Godkendelse", style: "bg-yellow-100 text-yellow-800" };
        case "confirmed":
            return { text: "Bekræftet! Alt er klart", style: "bg-green-100 text-green-800" };
        case "deposit_required":
            return { text: "Depositum Kræves", style: "bg-blue-100 text-blue-800" };
        case "customer_cancelled":
            return { text: "Aflyst af Dig", style: "bg-gray-100 text-gray-700" };
        case "artist_cancelled":
            return { text: "Aflyst af Tatovøren", style: "bg-red-100 text-red-800" };
        default:
            return { text: "Ukendt Status", style: "bg-gray-200 text-gray-800" };
    }
};

// Robust Date/Time Formatting (Placeholder/Direct Implementation) 
const formatDisplayDateTime = (dateString: string |  Date | null): string => {
    if (dateString != null) {
        const date = new Date(dateString);
        // Explicitly defines options to guarantee both date and time are included
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',      // Forces time display
            minute: '2-digit',    // Forces time display
            hour12: false,        // Uses 24-hour time
        };
        // Using 'da-DK' for Danish locale based on your original code's language, 
        // or 'undefined' to use the user's browser locale.
        return date.toLocaleString('da-DK', options); 
    }
    return "-"
};

// --- 3. Component Types ---
type Tattoo = any; // Placeholder for imported type
type Booking = {
    id: string;
    email: string;
    phone_number: string;
    name: string;
    date_and_time: string;
    created_at: string;
    status: string;
    is_FirstTattoo: boolean;
    internal_notes: string;
    edited_date_and_time: string | null;
    tattoos: Tattoo[];
};

interface BookingInfoProps {
    booking: Booking;
}

// --- 4. Revised BookingInfo Component ---
export default function BookingInfo({ booking }: BookingInfoProps) {
    const statusInfo = getStatusDisplay(booking.status);
    const formated_date_and_time = formatDisplayDateTime(booking.date_and_time);
    const formated_edited_date_and_time = formatDisplayDateTime(booking.edited_date_and_time);
    const formated_created_at = formatDisplayDateTime(booking.created_at);

    return (
        <div className="p-6  rounded-xl max-w-lg mx-auto border-2 border-black">
            {/* 1. Main Header */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                📅 Din booking
            </h2>
            
            <div className="space-y-6">
                {/* 2. Key Detail: Status (Most Important) */}
                <div className="p-3 rounded-lg border">
                    <span className="block text-sm font-bold text-rose-300 uppercase tracking-wider">
                        Status
                    </span>
                    <p className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${statusInfo.style}`}>
                        {statusInfo.text}
                    </p>
                </div>

                {/* 3. Key Detail: Date and Time */}
                <div>
                    <span className="block text-sm text-rose-300 uppercase tracking-wider">
                        Date & Time
                    </span>
                    <p className="font-bold text-gray-900">
                        {/* Assuming formatDateTime handles localization and clarity */}
                        {formated_date_and_time}
                    </p>
                    {booking.edited_date_and_time && (
                        <p className="text-xs text-gray-500 mt-1">
                            Last modified: {formated_edited_date_and_time}
                        </p>
                    )}
                </div>
                
                {/* 4. Contact Information Summary */}
                <div className="border-t pt-4">
                    <h3 className="text-l font-semibold text-black mb-2">
                        Kunde Info
                    </h3>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Navn:</span> {booking.name}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Email:</span> {booking.email}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Telefon:</span> {booking.phone_number}
                    </p>
                </div>


                {/* 5. Action: Cancellation (Appears only when eligible) */}
                {booking.status !== "customer_cancelled" &&
                booking.status !== "artist_cancelled" && (
                    <div className="mt-6 pt-4 border-t border-red-200">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">
                            ❌ Need to Cancel?
                        </h3>
                        <CancelBooking />
                    </div>
                )}
            </div>

            {/* 6. Least Prominent Detail: Reference ID */}
            <div className="mt-8 pt-4 border-t text-xs text-gray-500 ">
                <p>Reference ID: {booking.id}</p>
                <p>Booked On: {formated_created_at}</p>
            </div>
        </div>
    );
}
