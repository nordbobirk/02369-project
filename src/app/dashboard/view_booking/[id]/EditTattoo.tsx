'use client'

import { Button } from '@/components/ui/button'
import { EditIcon } from "lucide-react";

export default function EditTattoo({ onEditAction }: { onEditAction: () => void }) {
    return (
        <Button onClick={onEditAction} variant="secondary">
            <EditIcon/>
        </Button>
    )
}
