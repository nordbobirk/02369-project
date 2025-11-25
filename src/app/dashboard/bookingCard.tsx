"use client"

import * as React from "react"

import ViewBooking from "@/app/dashboard/ViewBooking";
import { Booking, Tattoo } from "./actions"
import { formatMinutesHrsMins } from "@/app/dashboard/utils/formatMinutes";
import { getTimeUntilBooking } from "@/app/dashboard/utils/getTimeUntilBooking";


export default function BookingCard({ booking }: { booking: Booking }) {
    return (
        <div
            className="my-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between "
        >
            <div>
                <div className="font-medium">Booking til {booking.name}</div>
                <div className="text-muted-foreground text-xs">
                    {(booking.tattoos == null || booking.tattoos.length == 0) ?
                        <div>
                            <p>Ingen tatovering med booking</p>
                        </div> :
                        <div>

                            <div>
                                Samlet varighed: {formatMinutesHrsMins(booking.tattoos?.reduce((acc: number, tattoo: Tattoo) => acc + tattoo.estimated_duration, 0))}
                            </div>
                            <div>
                                {getTimeUntilBooking(booking.date_and_time)}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <ViewBooking bookingId={booking.id} />
        </div>
    )
}