import { getPendingBookingById } from './actions';
import AcceptButton from "@/app/dashboard/pending_bookings/[id]/AcceptPendingBooking";
import RejectButton from "@/app/dashboard/pending_bookings/[id]/RejectPendingBooking";
import BookingInfoCard from "@/app/dashboard/pending_bookings/[id]/BookingInfo";

// test id:  b2345678-2345-2345-2345-123456789002

export default async function PendingBookingsPage({ params }: { params: {id: string } }) {
    const bookings = await getPendingBookingById((await params).id);

    return (
        <>
            <hgroup>
                <h1> Velkommen til: </h1>
                <p>Kaj Salamanders biks</p>
            </hgroup>
            <p>ved ikke lige hvorfor både header hgroups og paragraphs er ens uden style</p>
            <div>
                <h1>Pending Booking:</h1>
                <pre>{JSON.stringify(bookings, null, 4)}</pre>
            </div>
            <div>
                <BookingInfoCard booking={bookings[0]} />
                <AcceptButton/><span> </span>
                <RejectButton/>
            </div>
        </>
    );
}

