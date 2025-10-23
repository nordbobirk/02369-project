import { getPendingBookings } from './actions';

export default async function PendingBookingsPage() {
    const bookings = await getPendingBookings();

    return (
        <>
        <h1> Lalallaahaaa page is working! </h1>
        <div>
            <h1>Pending Bookings:</h1>
            <pre>{JSON.stringify(bookings, null, 4)}</pre>
        </div>
        </>
    );
}

