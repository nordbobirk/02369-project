'use client'

import { Button } from '@/components/ui/button'
import { updateTattooDetails } from './actions'
import { useRouter } from 'next/navigation'

interface SaveEditTattooProps {
    tattooId: string;
    width?: number;
    height?: number;
    placement: string;
    detailLevel: string;
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

    const handleSave = async () => {
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
    };

    return (
        <Button onClick={handleSave} variant="default">
            Gem
        </Button>
    )
}
