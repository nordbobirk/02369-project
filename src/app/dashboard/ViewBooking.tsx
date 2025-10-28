"use client"

import {Button} from "@/components/ui/button";
import {ExternalLinkIcon} from "lucide-react";
import * as React from "react";
import {useParams} from "next/navigation";
import Link from "next/link";

export default function ViewBooking({ bookingId }: { bookingId: string }) {

    const onClick = async () => {
        // const id = 1212;
        console.log("navigating to booking with id: " + bookingId);
    }

    return (
        <Link href="/dashboard/pending_bookings/[id]" as={`/dashboard/pending_bookings/${bookingId}`}>
            <Button onClick={onClick}>
                Se
                <ExternalLinkIcon />
            </Button>
        </Link>
    )
}
