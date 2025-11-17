'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { cancelBooking } from './actions'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CancelBooking() {
    const [isOpen, setIsOpen] = useState(false)
    const params = useParams()
    const bookingId = params.id as string

    const handleCancel = async () => {
        try {
            await cancelBooking(bookingId)
            setIsOpen(false)
        } catch (error) {
            console.error('Fejl ved aflysning af booking:', error)
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    Aflys Booking
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Denne handling vil aflyse bookingen. Kunden vil modtage en email om aflysningen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuller</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                        Aflys Booking
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
