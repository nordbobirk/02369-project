"use client"

import { useState } from "react";
import { TattooImages } from "@/app/dashboard/pending_bookings/[id]/TattooImages";

type Tattoo = {
    id: number;
    notes: string;
    width: number;
    height: number;
    placement: string;
    tattoo_type: string;
    detail_level: string;
    booking_images: { id: number; image_url: string }[];
    colored_option: string;
    estimated_price: number;
    color_description: string | null;
    estimated_duration: number;
};

interface TattooInfoProps {
    tattoos: Tattoo[];
}

export function TattooInfo({ tattoos }: TattooInfoProps) {
    const [index, setIndex] = useState(0);

    if (!tattoos.length) {
        return (
                <p>Ingen tatoveringer</p>
        );
    }

    const tattoo = tattoos[index];

    return (
        <>
            <div className="p-2 border border-black rounded-lg">
                <div>
                    <div className="flex items-center justify-between w-full">
                        <div className="font-medium">
                            Tattoo {index + 1} <span className="text-sm text-muted-foreground">({tattoo.tattoo_type})</span>
                        </div>
                    </div>
                    <div className="absolute p-2 top-2 right-2 ">
                        <TattooImages/>
                    </div>
                </div>
                    <div className="text-sm ">
                        <div className="flex flex-col space-y-1">
                            <div className="whitespace-pre-wrap break-words">{tattoo.notes}</div>
                            <div>
                                <span className="font-medium">Størrelse:</span> {tattoo.width} x {tattoo.height} cm
                            </div>
                            <div>
                                <span className="font-medium">Placering:</span> {tattoo.placement}
                            </div>
                            <div>
                                <span className="font-medium">Detaljeniveau:</span> {tattoo.detail_level}
                            </div>
                            <div>
                                <span className="font-medium">Farvevalg:</span> {tattoo.colored_option}
                            </div>
                            {tattoo.color_description && (
                                <div>
                                    <span className="font-medium">Farvebeskrivelse:</span> {tattoo.color_description}
                                </div>
                            )}
                            <div>Est. tid: {tattoo.estimated_duration} minutter</div>
                            <div>Est. pris: {tattoo.estimated_price} kr</div>
                        </div>
                    </div>
                <div className="px-4 pb-4 flex justify-between items-center">
                    <button
                        onClick={() => setIndex(i => Math.max(i - 1, 0))}
                        disabled={index === 0}
                        className="btn-ghost"
                    >
                        ←
                    </button>
                    <div className="text-sm text-muted-foreground">
                        {index + 1} / {tattoos.length}
                    </div>
                    <button
                        onClick={() => setIndex(i => Math.min(i + 1, tattoos.length - 1))}
                        disabled={index === tattoos.length - 1}
                        className="btn-ghost"
                    >
                        →
                    </button>
                </div>
        </div>
    </>
    );
}
