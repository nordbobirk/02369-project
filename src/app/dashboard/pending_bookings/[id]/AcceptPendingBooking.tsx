'use client'

import { Button } from '@/components/ui/button'
import { acceptPendingBooking } from "@/app/dashboard/pending_bookings/[id]/actions";
import { useParams } from 'next/navigation'

export default function AcceptButton() {

    const params = useParams();
    const id = params.id as string;

    const onClick = async () => {
        console.log("accepting booking with id: " + id);
        await acceptPendingBooking(id);
    }

    return (
        <Button onClick={onClick} variant="secondary">
            Accept
        </Button>
    )
}