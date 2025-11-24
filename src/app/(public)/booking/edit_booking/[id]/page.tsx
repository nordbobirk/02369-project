import { getPendingBookingById } from '@/app/(public)/booking/edit_booking/[id]/actions';
import BookingInfo from "@/app/(public)/booking/edit_booking/[id]/BookingInfo";
import BookingGate from "./BookingGate"; // The client component we made

export default async function ViewBookingsPage({ params }: { params: { id: string } }) {
    // 1. Get the ID from the URL (e.g. "466058")
    // In Next.js 15+, params must be awaited. In 14, it's optional but good practice.
    const { id } = await params; 
    
    // 2. Pass that URL ID to your database function
    const bookings = await getPendingBookingById(id);

    // 3. If database returns nothing
    if (!bookings || bookings.length === 0) {
        return <div>Ingen booking fundet med id: {id}</div>;
    }

    // 4. Pass the ID to the Gate (for verification) 
    //    and the Data to the Info component (hidden until verified)
    return (
        <BookingGate bookingId={id}>
             {/* This component is only rendered AFTER the gate is unlocked */}
            <BookingInfo booking={bookings[0]} />
        </BookingGate>
    );
}