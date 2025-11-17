'use client'

import { Button } from '@/components/ui/button'

export default function CancelEditTattoo({ onCancelAction }: { onCancelAction: () => void }) {
    return (
        <Button onClick={onCancelAction} variant="outline">
            Annuller
        </Button>
    )
}
