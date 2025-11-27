'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { updateTattooDetails } from './actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SaveEditTattooProps {
    tattooId: string;
    width?: number;
    height?: number;
    placement: string;
    detailLevel: string | null;
    coloredOption: string;
    colorDescription: string;
    onSaveAction: () => void;
}

export default function SaveEditTattoo({
                                           tattooId,
                                           width,
                                           height,
                                           placement,
                                           detailLevel,
                                           coloredOption,
                                           colorDescription,
                                           onSaveAction
                                       }: SaveEditTattooProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await updateTattooDetails(
            tattooId,
            width,
            height,
            placement,
            detailLevel,
            coloredOption,
            colorDescription
        );
        onSaveAction();
        router.refresh();
        setIsSaving(false);
    };

    return (
        <Button onClick={handleSave} disabled={isSaving} variant="default">
            {isSaving ? <Spinner className="mr-2" /> : null}
            Gem
        </Button>
    )
}
