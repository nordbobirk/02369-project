import * as React from "react"

import ViewBooking from "@/app/dashboard/ViewBooking";
import { Booking, Tattoo } from "./actions"
import { formatMinutesHrsMins } from "@/app/dashboard/utils/formatMinutes";


// Should create a new user-side component for this. Currently also used in actions which is serverside
function getTimeUntilBooking(date_and_time: string): string {
    const now = new Date();
    const bookingDate = new Date(date_and_time);

    const diffMs = bookingDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Bookingen er startet";

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} Dage, ${hours} Timer, ${minutes} Minuter indtil bookingen`;
}


export default function BookingCard({ booking }: { booking: Booking }) {
    // Map statuses to Tailwind classes
    const statusClasses: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded",
        edited: "bg-blue-100 text-blue-800 px-2 py-0.5 rounded",
        confirmed: "bg-green-100 text-green-800 px-2 py-0.5 rounded",
        cancelled: "bg-red-100 text-red-800 px-2 py-0.5 rounded",
    };

    const statusClass = booking.status
        ? statusClasses[booking.status.toLowerCase()] || "bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
        : "";

    return (
        <div className="my-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between">
            <div>
                <div className="flex items-center gap-2 font-medium">
                    <span>Booking til {booking.name}</span>
                    {booking.status && <span className={statusClass}>{booking.status}</span>}
                </div>
                <div className="text-muted-foreground text-xs">
                    {(!booking.tattoos || booking.tattoos.length === 0) ? (
                        <p>Ingen tatovering med booking</p>
                    ) : (
                        <div>
                            <div>
                                Samlet varighed:{" "}
                                {formatMinutesHrsMins(
                                    booking.tattoos.reduce((acc: number, tattoo: Tattoo) => acc + tattoo.estimated_duration, 0)
                                )}
                            </div>
                            <div>{getTimeUntilBooking(booking.date_and_time)}</div>
                        </div>
                    )}
                </div>
            </div>
            <ViewBooking bookingId={booking.id} />
        </div>
    );
}