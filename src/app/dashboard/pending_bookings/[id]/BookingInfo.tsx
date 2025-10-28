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

export default function BookingInfoCard({ booking }: BookingInfoProps) {
    return (
        <Card className="mb-4 min-w-[500px]">
            <CardHeader>
                <span className="font-semibold text-lg">{booking.name}</span>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row items-start gap-6">
                    <div className="text-sm space-y-1 flex-1">
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
                            <span className="font-medium">Oprettet:</span>{" "}
                            {new Date(booking.created_at).toLocaleString()}
                        </div>
                        <div>
                            <span className="font-medium">Interne Notes:</span>{" "}
                            {booking.internal_notes || "—"}
                        </div>
                        <div>
                            <span className="font-medium">Ændret:</span>{" "}
                            {booking.edited_date_and_time
                                ? new Date(booking.edited_date_and_time).toLocaleString()
                                : "—"}
                        </div>
                    </div>
                    <div className="min-w-[340px]">
                        <TattooInfo tattoos={booking.tattoos} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function formatPhoneNumber(phoneNumber: string): string {
    const match = phoneNumber.match(/^(\+\d{2})\s?(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (!match) return phoneNumber;
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
}