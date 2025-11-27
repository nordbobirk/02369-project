"use client";

import { useState, useCallback, useMemo } from "react";
import CancelBooking from "@/app/(public)/booking/edit_booking/[id]/CancelBooking";
import { DatePicker } from "./DatePicker";
import { BookingFormData, estimateTime } from "@/app/(public)/booking/_components/Form"; 
import { updateBookingDate } from "./actions";

// --- Helper Functions ---
const getStatusDisplay = (status: string) => {
    switch (status) {
        case "pending":
            return { text: "Afventer Godkendelse", style: "bg-yellow-100 text-yellow-800" };
        case "edited": // <--- Added new status for display
            return { text: "Opdateret", style: "bg-orange-100 text-orange-800" };
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

const formatDisplayDateTime = (dateString: string | Date | null): string => {
    if (dateString != null) {
        const date = new Date(dateString);
        return date.toLocaleString('da-DK', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false,
        });
    }
    return "-"
};

// --- Types ---
type Tattoo = any; 
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

// --- MAIN COMPONENT ---
export default function BookingInfo({ booking }: BookingInfoProps) {
    // --- UI STATE ---
    const [isSelectionAvailable, setIsSelectionAvailable] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavedSuccess, setIsSavedSuccess] = useState(false);

    // --- 1. STABLE INITIAL DATA ---
    const initialFormData = useMemo(() => ({
        ...booking,
        dateTime: booking.date_and_time ? new Date(booking.date_and_time) : null, 
    } as unknown as BookingFormData), [booking]);

    // --- 2. ISOLATED STATE FOR THE PICKER ---
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        initialFormData.dateTime
    );

    // --- 3. MEMOIZED DURATION ---
    const estimatedDuration = useMemo(() => {
        return estimateTime(initialFormData);
    }, [initialFormData]);

    // --- 4. STABLE HANDLERS ---
    const handleDateChange = useCallback((newDate: Date | null) => {
        setSelectedDate((prevDate) => {
            if (prevDate?.toISOString() === newDate?.toISOString()) {
                return prevDate;
            }
            return newDate;
        });
        setIsSavedSuccess(false);
    }, []);

    const handleAvailabilityChange = useCallback((available: boolean) => {
        setIsSelectionAvailable((prev) => (prev === available ? prev : available));
    }, []);

    const handleCancel = () => {
        setSelectedDate(initialFormData.dateTime); 
        setIsCalendarOpen(false); 
        setIsSavedSuccess(false);
    };

    // --- 5. SAVE LOGIC ---
    const handleConfirm = async () => {
        if (!selectedDate) return;

        setIsSaving(true);

        try {
            const result = await updateBookingDate(booking.id, selectedDate);

            if (result.success) {
                setIsSaving(false);
                setIsSavedSuccess(true);

                setTimeout(() => {
                    setIsCalendarOpen(false);
                    setIsSavedSuccess(false);
                }, 1500);
            } else {
                console.error(result.error);
                alert("Fejl: Kunne ikke opdatere datoen. Prøv igen.");
                setIsSaving(false);
            }
        } catch (e) {
            console.error("Network or Server Error:", e);
            alert("Der opstod en uventet fejl.");
            setIsSaving(false);
        }
    };

    // --- Display Helpers ---
    const statusInfo = getStatusDisplay(booking.status);
    const formated_current_display = formatDisplayDateTime(booking.date_and_time);
    const formated_created_at = formatDisplayDateTime(booking.created_at);
    
    const isDateChanged = selectedDate?.toISOString() !== new Date(booking.date_and_time).toISOString();

    return (
        <div className="w-full max-w-3xl mx-auto p-6 md:p-10 rounded-xl border-2 border-black bg-white">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
                📅 Din booking
            </h2>
            
            <div className="space-y-8">
                {/* Status Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg border bg-gray-50">
                        <span className="block text-sm font-bold text-rose-300 uppercase tracking-wider mb-2">
                            Status
                        </span>
                        <p className={`inline-flex items-center px-3 py-1 rounded-full text-md font-bold ${statusInfo.style}`}>
                            {statusInfo.text}
                        </p>
                    </div>

                    <div className="p-4 rounded-lg border bg-gray-50">
                        <span className="block text-sm font-bold text-rose-300 uppercase tracking-wider mb-2">
                            Nuværende Tid
                        </span>
                        <p className="font-bold text-gray-900 text-lg">
                            {formated_current_display}
                        </p>
                        
                         {booking.edited_date_and_time && (
                            <p className="text-xs text-gray-500 mt-1">
                                Ændret: {formatDisplayDateTime(booking.edited_date_and_time)}
                            </p>
                        )}
                    </div>
                </div>

                {/* --- COLLAPSIBLE DATE PICKER SECTION --- */}
                <div className="border-t border-b border-gray-100 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Ændre tidspunkt?</h3>
                    </div>

                    {!isCalendarOpen ? (
                        /* CLOSED STATE */
                        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 text-center">
                            <p className="text-gray-500 mb-4 text-sm">
                                Ønsker du at flytte din tid? Klik nedenfor for at se ledige tider.
                            </p>
                            <button 
                                onClick={() => setIsCalendarOpen(true)}
                                className="bg-white border-2 border-black text-black px-6 py-2 rounded-lg font-bold hover:bg-black hover:text-white transition-all shadow-sm"
                            >
                                Vælg ny dato
                            </button>
                        </div>
                    ) : (
                        /* OPEN STATE */
                        <div className="animate-in fade-in zoom-in-95 duration-200 space-y-4">
                            
                            <DatePicker
                                formData={initialFormData}
                                currentDate={selectedDate}
                                estimatedDuration={estimatedDuration}
                                onDateChange={handleDateChange} 
                                onAvailabilityChange={handleAvailabilityChange}
                            />

                            {/* --- ACTION BAR --- */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 sticky bottom-0 z-10">
                                <div>
                                    <span className="text-xs uppercase font-bold text-gray-400 block mb-1">
                                        Ny Valgt Dato
                                    </span>
                                    <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                        {formatDisplayDateTime(selectedDate)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={handleCancel}
                                        disabled={isSaving || isSavedSuccess}
                                        className="flex-1 md:flex-none px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        Annuller
                                    </button>
                                    
                                    <button 
                                        disabled={!isDateChanged || !isSelectionAvailable || isSaving || isSavedSuccess}
                                        onClick={handleConfirm}
                                        className={`
                                            flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 min-w-[140px]
                                            ${isSavedSuccess 
                                                ? "bg-green-600 hover:bg-green-700" 
                                                : (isDateChanged && isSelectionAvailable) 
                                                    ? "bg-black hover:bg-gray-800 hover:shadow-md transform hover:-translate-y-0.5" 
                                                    : "bg-gray-300 cursor-not-allowed" 
                                            }
                                        `}
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Gemmer...</span>
                                            </>
                                        ) : isSavedSuccess ? (
                                            <>
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Gemt!</span>
                                            </>
                                        ) : (
                                            "Bekræft"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Contact Info */}
                <div className="pt-2">
                    <h3 className="text-lg font-semibold text-black mb-4">
                        Kunde Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                        <div>
                            <span className="block font-medium text-gray-400 text-xs uppercase">Navn</span>
                            {booking.name}
                        </div>
                        <div>
                            <span className="block font-medium text-gray-400 text-xs uppercase">Email</span>
                            {booking.email}
                        </div>
                        <div>
                            <span className="block font-medium text-gray-400 text-xs uppercase">Telefon</span>
                            {booking.phone_number}
                        </div>
                    </div>
                </div>

                {/* Cancellation */}
                {booking.status !== "customer_cancelled" &&
                booking.status !== "artist_cancelled" && (
                    <div className="pt-6 border-t border-red-100">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">
                            ❌ Aflys booking
                        </h3>
                        <div className="bg-red-50 p-4 rounded-lg">
                           <CancelBooking />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-10 pt-4 border-t text-xs text-gray-400 flex justify-between">
                <span>Ref: {booking.id}</span>
                <span>Oprettet: {formated_created_at}</span>
            </div>
        </div>
    );
}