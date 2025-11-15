'use client'

import { Button } from '@/components/ui/button'
import { updateBookingDetails } from './actions'
import { useRouter } from 'next/navigation'

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

    const handleSave = async () => {
        await updateBookingDetails(bookingId, email, phoneNumber, internalNotes);
        onSaveAction();
        router.refresh();
    };

    return (
        <Button onClick={handleSave} variant="default">
            Gem
        </Button>
    )
}
