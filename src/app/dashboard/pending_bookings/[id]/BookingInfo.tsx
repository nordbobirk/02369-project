"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {TattooInfo} from "@/app/dashboard/pending_bookings/[id]/TattoInfo";

type Booking = {
    id: string,
    email: string,
    phone_number: string,
    name: string,
    date_and_time: string,
    created_at: string,
    status: string,
    is_FirstTattoo: boolean,
    internal_notes: string,
    edited_date_and_time: string | null,
    tattoos: never[],
};

interface BookingInfoProps {
    booking: Booking;
}

// TODO: fix så den ikke brækker sig ved Reject...
// TODO: flyt knapperne ind i BookingInfoCard

export default function BookingInfoCard({ booking }: BookingInfoProps) {
    return (
        <Card className="mb-4 min-w-[700px]">
            <div className="flex flex-row items-stretch gap-8 p-4 relative h-100">
                <div className="flex-1">
                    <CardHeader>
                        <span className="font-semibold text-lg">{booking.name}</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm space-y-1">
                            <div>
                                <span className="font-medium">Tid og dato:</span>{" "}
                                {new Date(booking.date_and_time).toLocaleString()}
                            </div>
                            <div><span className="font-medium">Status: {booking.status}</span></div>
                            <div><span className="font-medium">Email:</span> {booking.email}</div>
                            <div><span className="font-medium">Telefon:</span> {formatPhoneNumber(booking.phone_number)}</div>
                            <div>
                                <span className="font-medium">Første Tattoo:</span>{" "}
                                {booking.is_FirstTattoo ? "Ja" : "Nope"}
                            </div>
                            <div>
                                {/*TODO: add time estimate here. */}
                                <span className="font-medium">summeret tid her!:</span>
                            </div>
                            <div>
                                {/*TODO: add price estimate here. */}
                                <span className="font-medium">summeret pris her!:</span>
                            </div>
                            <div>
                                <span className="font-medium">Oprettet:</span>{" "}
                                {new Date(booking.created_at).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-medium">Ændret:</span>{" "}
                                {booking.edited_date_and_time
                                    ? new Date(booking.edited_date_and_time).toLocaleString()
                                    : "—"}
                            </div>
                            <div>
                                <span className="font-medium">Interne Notes:</span>
                                <div className="max-h-[4.5rem] overflow-y-auto break-words pr-2">
                                en meget lang noget om et eller andet som er interessant for mig.en meget lang noget om et eller andet som er interessant for mig. en meget lang noget om et eller andet som er interessant for mig.en meget lang noget om et eller andet som er interessant for mig.
                                </div>
                                {/*TODO: lav en edit knap til interne notes der efterfølgende viser en cancel og save knap*/}
                                {/*{" "}*/}
                                {/*{booking.internal_notes || "—"}*/}
                            </div>
                        </div>
                    </CardContent>
                </div>
                <div className=" w-1/2 h-5/6  flex-shrink-0 overflow-auto"> {/*min-w-[340px] max-h-[75%]*/}
                    <TattooInfo tattoos={booking.tattoos} />
                </div>
            </div>
        </Card>
    );
}

/**
 * Formats a phone number string into a more readable format.
 * Example: "+4512345678" -> "+45 12 34 56 78"
 *
 * @param phoneNumber - The phone number string to format.
 */
function formatPhoneNumber(phoneNumber: string): string {
    const match = phoneNumber.match(/^(\+\d{2})\s?(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (!match) return phoneNumber;
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
}