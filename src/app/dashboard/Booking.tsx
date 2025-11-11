import * as React from "react"

import ViewBooking from "@/app/dashboard/ViewBooking";
import { Booking, Tattoo } from "./actions"
import {formatMinutesHrsMins} from "@/app/dashboard/utils/formatMinutes";


// Should create a new user-side component for this. Currently also used in actions which is serverside
function getTimeUntilBooking(date_and_time: string): string {
    const now = new Date();
    const bookingDate = new Date(date_and_time);

    const diffMs = bookingDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Booking time has passed";

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} Dage, ${hours} Timer, ${minutes} Minuter indtil bookingen`;
}


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