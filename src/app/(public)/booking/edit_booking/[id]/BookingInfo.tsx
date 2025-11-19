'use client'

import { useState } from "react";
import { TattooInfo } from "@/app/dashboard/view_booking/[id]/TattoInfo";
import type { Tattoo } from "@/app/dashboard/view_booking/[id]/TattoInfo";
import { formatMinutesHrsMins } from "@/app/dashboard/utils/formatMinutes";
import {formatPhoneNumber} from "@/app/dashboard/utils/formatPhoneNumber";
import {formatDateTime } from "@/app/dashboard/utils/formatDateTime";
import EditBooking from "@/app/dashboard/view_booking/[id]/EditBooking";
import SaveEditBooking from "@/app/dashboard/view_booking/[id]/SaveEditBooking";
import CancelEditBooking from "@/app/dashboard/view_booking/[id]/CancelEditBooking";
import CancelBooking from "@/app/(public)/booking/edit_booking/[id]/CancelBooking";

type Booking = {
    id: string;
    email: string;
    phone_number: string;
    name: string;
    date_and_time: string;
    created_at: string;
    status: string;
    is_FirstTattoo: boolean;
    internal_notes: string;
    edited_date_and_time: string | null;
    tattoos: Tattoo[];
};

interface BookingInfoProps {
    booking: Booking;
}

export default function BookingInfo({ booking }: BookingInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmail, setEditedEmail] = useState(booking.email);
    const [editedPhone, setEditedPhone] = useState(booking.phone_number);
    const [editedNotes, setEditedNotes] = useState(booking.internal_notes ?? "");

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedEmail(booking.email);
        setEditedPhone(booking.phone_number);
        setEditedNotes(booking.internal_notes);
        setIsEditing(false);
    };

    const handleSave = async () => {
        // SaveEditBooking håndterer gemningen
        setIsEditing(false);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row items-stretch gap-4 p-2 border border-black rounded-lg ">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg break-words">{booking.name}</span>
                        {!isEditing ? (
                            <EditBooking onEditAction={handleEdit} />
                        ) : (
                            <div className="flex gap-2">
                                <SaveEditBooking
                                    bookingId={booking.id}
                                    email={editedEmail}
                                    phoneNumber={editedPhone}
                                    internalNotes={editedNotes}
                                    onSaveAction={handleSave}
                                />
                                <CancelEditBooking onCancelAction={handleCancel} />
                            </div>
                        )}
                    </div>
                    <div className="text-sm space-y-1 mt-2">
                        <div>
                            <span className="font-medium">Tid og dato:</span>{" "}
                            {formatDateTime(new Date(booking.date_and_time).toLocaleString())}
                        </div>
                        <div>
                            <span className="font-medium">Status:</span> {booking.status}
                        </div>
                        <div>
                            <span className="font-medium">Email:</span>{" "}
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    className="ml-2 px-2 py-1 border border-gray-300 rounded"
                                />
                            ) : (
                                booking.email
                            )}
                        </div>
                        <div>
                            <span className="font-medium">Telefon:</span>{" "}
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editedPhone}
                                    onChange={(e) => setEditedPhone(e.target.value)}
                                    className="ml-2 px-2 py-1 border border-gray-300 rounded"
                                />
                            ) : (
                                formatPhoneNumber(booking.phone_number)
                            )}
                        </div>
                        <div>
                            <span className="font-medium">Første Tattoo:</span>{" "}
                            {booking.is_FirstTattoo ? "Ja" : "Nope"}
                        </div>
                        <div>
                            <span className="font-medium">Samlet tid for tatoveringer:</span>{" "}
                            {formatMinutesHrsMins(booking.tattoos?.reduce((acc, t) => acc + (t.estimated_duration ?? 0), 0) ?? 0)}
                        </div>
                        <div>
                            <span className="font-medium">Samlet pris for tatoveringer:</span>{" "}
                            {booking.tattoos?.reduce((acc, t) => acc + (t.estimated_price ?? 0), 0) ?? 0} kr
                        </div>
                        <div>
                            <span className="font-medium">Oprettet:</span>{" "}
                            {formatDateTime(new Date(booking.created_at).toLocaleString())}
                        </div>
                        <div>
                        <span className="font-medium">Ændret:</span>{" "}
                        {formatDateTime(booking.edited_date_and_time
                            ? new Date(booking.edited_date_and_time).toLocaleString()
                            : "—")}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex-shrink-0">
                    <div className="max-h-[55vh] md:max-h-[100%] overflow-auto">
                        <TattooInfo tattoos={booking.tattoos} />
                    </div>
                </div>
                
        </div>
            {booking.status !== "customer_cancelled" &&
            booking.status !== "artist_cancelled" && (
            <div className="mt-4">
            <CancelBooking />
            </div>
            )}
        </div>
    );
}
