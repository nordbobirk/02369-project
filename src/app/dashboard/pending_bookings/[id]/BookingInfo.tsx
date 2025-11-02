// src/app/dashboard/pending_bookings/[id]/BookingInfo.tsx
import { TattooInfo } from "@/app/dashboard/pending_bookings/[id]/TattoInfo";
import type { Tattoo } from "@/app/dashboard/pending_bookings/[id]/TattoInfo";
import AcceptButton from "@/app/dashboard/pending_bookings/[id]/AcceptPendingBooking";
import RejectButton from "@/app/dashboard/pending_bookings/[id]/RejectPendingBooking";

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

export default function BookingInfo({ booking }: BookingInfoProps) {
    return (
        <div className="flex flex-col md:flex-row items-stretch gap-4 p-2 border border-black rounded-lg">
            <div className="flex-1 min-w-0">
                <span className="font-semibold text-lg break-words">{booking.name}</span>
                <div className="text-sm space-y-1 mt-2">
                    <div>
                        <span className="font-medium">Tid og dato:</span>{" "}
                        {new Date(booking.date_and_time).toLocaleString()}
                    </div>
                    <div>
                        <span className="font-medium">Status:</span> {booking.status}
                    </div>
                    <div>
                        <span className="font-medium">Email:</span> {booking.email}
                    </div>
                    <div>
                        <span className="font-medium">Telefon:</span>{" "}
                        {formatPhoneNumber(booking.phone_number)}
                    </div>
                    <div>
                        <span className="font-medium">Første Tattoo:</span>{" "}
                        {booking.is_FirstTattoo ? "Ja" : "Nope"}
                    </div>
                    <div>
                        <span className="font-medium">Samlet tid for tatoveringer:</span>{" "}
                        {booking.tattoos?.reduce((acc, t) => acc + (t.estimated_duration ?? 0), 0) ?? 0} min
                    </div>
                    <div>
                        <span className="font-medium">Samlet pris for tatoveringer:</span>{" "}
                        {booking.tattoos?.reduce((acc, t) => acc + (t.estimated_price ?? 0), 0) ?? 0} kr
                    </div>
                    <div>
                        <span className="font-medium">Oprettet:</span>{" "}
                        {new Date(booking.created_at).toLocaleString()}
                    </div>
                    <div>
                        {/*TODO: fix - så denne kan redigeres*/}
                        <span className="font-medium">Interne Notes:</span>
                        <div className="max-h-[6rem] overflow-y-auto break-words p-2 mt-1 border border-black rounded-lg">
                            {booking.internal_notes || "—"}
                        </div>
                    </div>
                    <div>
                        <span className="font-medium">Ændret:</span>{" "}
                        {booking.edited_date_and_time
                            ? new Date(booking.edited_date_and_time).toLocaleString()
                            : "—"}
                    </div>
                </div>
                {/* tilføjer accept reject button hvis status er pending eller edited */}
                { (booking.status === "pending" || booking.status === "edited") && (
                    <div>
                        <br/>
                        <AcceptButton /> <span> </span>
                        <RejectButton />
                    </div>
                )}
            </div>

            <div className="w-full md:w-1/2 flex-shrink-0">
                <div className="max-h-[55vh] md:max-h-[100%] overflow-auto">
                    <TattooInfo tattoos={booking.tattoos} />
                </div>
            </div>
        </div>
    );
}

function formatPhoneNumber(phoneNumber: string): string {
    const match = phoneNumber.match(/^(\+\d{2})\s?(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (!match) return phoneNumber;
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
}
