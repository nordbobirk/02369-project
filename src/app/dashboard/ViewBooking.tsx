"use client"

import {Button} from "@/components/ui/button";
import {ExternalLinkIcon} from "lucide-react";
import * as React from "react";
import Link from "next/link";

/**
 * ViewBooking Component - a button that redirects to the pending booking [id] page
 *
 * @param bookingId - the id of the booking to view
 */
export default function ViewBooking({ bookingId }: { bookingId: string }) {

    return (
        <Link href="/dashboard/pending_bookings/[id]" as={`/dashboard/pending_bookings/${bookingId}`}>
            <Button>
                Se
                <ExternalLinkIcon />
            </Button>
        </Link>
    )
}
