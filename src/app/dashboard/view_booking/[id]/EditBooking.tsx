'use client'

import { Button } from '@/components/ui/button'

import { useParams } from 'next/navigation'
import {EditIcon} from "lucide-react";

export default function AcceptButton() {

    const params = useParams();
    const id = params.id as string;

    // TODO: Implement editBooking function in actions.ts
    const onClick = async () => {
        return;
    }


    return (
        <Button onClick={onClick} variant="secondary">
            <EditIcon/>
        </Button>
    )
}