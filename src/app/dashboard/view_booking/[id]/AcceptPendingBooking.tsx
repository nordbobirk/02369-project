'use client'

import { Button } from '@/components/ui/button'
import { acceptPendingBooking } from "@/app/dashboard/view_booking/[id]/actions";
import { useParams } from 'next/navigation'
import Link from 'next/link';

export default function AcceptButton() {

    const params = useParams();
    const id = params.id as string;

    const onClick = async () => {
        await acceptPendingBooking(id);
    }

    return (
        <Link href="/dashboard/">
            <Button onClick={onClick} variant="secondary">
                Accepter
            </Button>
        </Link>
    )
}