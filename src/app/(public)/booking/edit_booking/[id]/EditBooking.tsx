'use client'

import { Button } from '@/components/ui/button'
import { EditIcon } from "lucide-react";

export default function EditBooking({ onEditAction }: { onEditAction: () => void }) {
    return (
        <div className="flex items-center gap-2">
            <p className="font-semibold text-rose-300 text-lg m-0">Edit</p>
            <Button onClick={onEditAction} variant="secondary">
                <EditIcon />
            </Button>
        </div>  
    )
}
