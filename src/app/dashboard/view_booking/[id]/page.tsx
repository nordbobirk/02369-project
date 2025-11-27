import { getPendingBookingById } from './actions';
import BookingInfo from "@/app/dashboard/view_booking/[id]/BookingInfo";

export default async function ViewBookingsPage({ params }: { params: {id: string } }) {
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
            <div>
                <BookingInfo booking={bookings[0]} />
            </div>
        </>
    );
}

