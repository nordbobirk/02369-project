import { getPendingBookingById } from './../actions';

// test id:  b2345678-2345-2345-2345-123456789002

export default async function PendingBookingsPage({ params }: { params: {id: string } }) {
    const bookings = await getPendingBookingById(params.id);

    return (
        <>
            <hgroup>
                <h1> Velkommen til: </h1>
                <p>Kaj Salamanders biks</p>
            </hgroup>
            <p>ved ikke lige hvorfor både header hgroups og paragraphs er ens uden style</p>
            <div>
                <h1>Pending Bookings:</h1>
                <pre>{JSON.stringify(bookings, null, 4)}</pre>
            </div>
        </>
    );
}

