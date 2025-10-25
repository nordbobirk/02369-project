'use client'

import { Button } from '@/components/ui/button'
import {rejectPendingBooking} from "@/app/dashboard/pending_bookings/actions";
import { useParams } from 'next/navigation'

export default function RejectButton() {

    const params = useParams();
    const id = params.id;

    const onClick = async () => {
        console.log("rejecting booking with id: " + id);
        await rejectPendingBooking(id);
    }

    return (
        <Button onClick={onClick} variant="secondary">
            Reject
        </Button>
    )
}