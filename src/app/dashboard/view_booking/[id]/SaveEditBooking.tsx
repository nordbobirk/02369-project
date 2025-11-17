'use client'

import { Button } from '@/components/ui/button'
import { updateBookingDetails } from './actions'
import { useRouter } from 'next/navigation'
import {useState} from "react";
import { Spinner } from "@/components/ui/spinner";

interface SaveEditBookingProps {
    bookingId: string;
    email: string;
    phoneNumber: string;
    internalNotes: string;
    onSaveAction: () => void;
}

export default function SaveEditBooking({
                                            bookingId,
                                            email,
                                            phoneNumber,
                                            internalNotes,
                                            onSaveAction
                                        }: SaveEditBookingProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await updateBookingDetails(bookingId, email, phoneNumber, internalNotes);
        onSaveAction();
        router.refresh();
        setIsSaving(false);
    };

    return (
        <Button onClick={handleSave} variant="default">
            {isSaving ? <Spinner className="mr-2" /> : null}
            Gem
        </Button>
    )
}
