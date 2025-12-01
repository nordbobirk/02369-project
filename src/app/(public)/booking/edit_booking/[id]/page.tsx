import { getPendingBookingById } from './actions';
import { verifyOTP } from './otp_utils';
import BookingInfo from "./BookingInfo";
import BookingGate from "./BookingGate";

export default async function ViewBookingsPage({ 
    params, 
    searchParams 
}: { 
    params: { id: string },
    searchParams: { code?: string } 
}) {
    const { id } = await params;
    const { code } = await searchParams;

    const bookings = await getPendingBookingById(id);

    if (!bookings || bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <h1 className="text-2xl font-bold">Ingen bookinger fundet</h1>
                <p>Der er ingen booking med id: {id}</p>
            </div>
        );
    }

    const booking = bookings[0];

    // If the URL has a code, and it matches the hash, we skip the gate!
    let isLinkValid = false;
    if (code && booking.otp_hash) {
        isLinkValid = verifyOTP(code, booking.otp_hash);
    }

    // 4. If link is valid, show content IMMEDIATELY (No Lock Screen)
    if (isLinkValid) {
        return <BookingInfo booking={booking} />;
    }

    // 5. Fallback: Show Lock Screen if link is missing or invalid
    // (This allows them to type the code manually if the link breaks)
    return (
        <BookingGate bookingId={booking.id.toString()}>
            <BookingInfo booking={booking} />
        </BookingGate>
    );
}