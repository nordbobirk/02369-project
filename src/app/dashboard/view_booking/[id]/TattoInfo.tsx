// src/app/dashboard/view_booking/[id]/TattoInfo.tsx
"use client";

import { useState } from "react";
import { TattooImages } from "@/app/dashboard/view_booking/[id]/TattooImages";
import {formatMinutesHrsMins} from "@/app/dashboard/utils/formatMinutes";

export type Tattoo = {
    id: number;
    notes: string;
    width?: number;
    height?: number;
    placement?: string;
    tattoo_type?: string;
    detail_level?: string;
    booking_images?: { id: number; image_url: string }[];
    colored_option?: string;
    estimated_price?: number;
    color_description?: string | null;
    estimated_duration?: number;
};

interface TattooInfoProps {
    tattoos: Tattoo[];
}

export function TattooInfo({ tattoos }: TattooInfoProps) {
    const [index, setIndex] = useState(0);

    if (!tattoos?.length) {
        return <p>Ingen tatoveringer</p>;
    }

    const tattoo = tattoos[index];

    return (
        <div className="p-2 border border-black rounded-lg flex flex-col md:flex-row gap-4">
            <div className="order-1 md:order-2 md:w-60 w-full">
                <TattooImages images={tattoo.booking_images} />
            </div>

            <div className="flex-1 order-2 md:order-1">
                <div className="flex items-center justify-between">
                    <div className="font-medium text-base">
                        Tattoo {index + 1}{" "}
                        <span className="text-sm text-muted-foreground">({tattoo.tattoo_type})</span>
                    </div>
                </div>

                <div className="text-sm mt-2">
                    <div className="flex flex-col space-y-1">
                        <div className="whitespace-pre-wrap break-words">{tattoo.notes}</div>
                        <div>
                            <span className="font-medium">Størrelse:</span>{" "}
                            {tattoo.width ?? "—"} x {tattoo.height ?? "—"} cm
                        </div>
                        <div>
                            <span className="font-medium">Placering:</span> {tattoo.placement ?? "—"}
                        </div>
                        <div>
                            <span className="font-medium">Detaljeniveau:</span> {tattoo.detail_level ?? "—"}
                        </div>
                        <div>
                            <span className="font-medium">Farvevalg:</span> {tattoo.colored_option ?? "—"}
                        </div>
                        {tattoo.color_description && (
                            <div>
                                <span className="font-medium">Farvebeskrivelse:</span> {tattoo.color_description}
                            </div>
                        )}
                        <div>Est. tid: {formatMinutesHrsMins(tattoo.estimated_duration)} </div>
                        <div>Est. pris: {tattoo.estimated_price ?? "—"} kr</div>
                    </div>
                </div>

                <div className="px-0 pb-0 mt-3 flex justify-between items-center gap-4">
                    <button
                        onClick={() =>
                            setIndex(i =>
                                tattoos.length <= 1 ? 0 : (i - 1 + tattoos.length) % tattoos.length
                            )
                        }
                        className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Previous tattoo"
                    >
                        ←
                    </button>

                    <div className="text-sm text-muted-foreground">
                        {index + 1} / {tattoos.length}
                    </div>

                    <button
                        onClick={() =>
                            setIndex(i =>
                                tattoos.length <= 1 ? 0 : (i + 1) % tattoos.length
                            )
                        }
                        className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Next tattoo"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}
