'use client'

import { Button } from '@/components/ui/button'


export default function CancelEditBooking({ onCancelAction }: { onCancelAction: () => void }) {
    return (
        <Button onClick={onCancelAction} variant="secondary">
            Fortryd
        </Button>
    )
}
