import { getPendingBookingById } from './actions';
import BookingInfo from "@/app/dashboard/pending_bookings/[id]/BookingInfo";

export default async function PendingBookingsPage({ params }: { params: {id: string } }) {
    const bookings = await getPendingBookingById((await params).id);

    if (!bookings || bookings.length === 0) {
        return (
            <div>
                <h1>Ingen bookinger fundet</h1>
                <p>Det er ingen booking med dette id.</p>
            </div>
        );
    }

    return (
        <>

            <h1>Booking med id: {bookings[0].id}</h1>
            <div>
                <BookingInfo booking={bookings[0]} />
            </div>
        </>
    );
}

