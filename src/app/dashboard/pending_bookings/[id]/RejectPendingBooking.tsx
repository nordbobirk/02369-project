'use client'

import { Button } from '@/components/ui/button'
import { rejectPendingBooking } from "@/app/dashboard/pending_bookings/[id]/actions";
import { useParams } from 'next/navigation'
import Link from 'next/link';

export default function RejectButton() {

    const params = useParams();
    const id = params.id;

    const onClick = async () => {
        console.log("rejecting booking with id: " + id);

        await rejectPendingBooking(id);
    }

    return (
        <Link href="/dashboard/">
            <Button onClick={onClick} variant="destructive">
                Afvis
            </Button>
        </Link>
    )
}