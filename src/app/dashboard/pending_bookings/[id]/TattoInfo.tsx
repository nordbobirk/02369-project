"use client"

import { useState } from "react";

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

    if (!tattoos.length) return <div>No tattoos</div>;

    const tattoo = tattoos[index];

    return (
        <div className="border rounded p-4 flex flex-col min-w-[300px]">

            <div className="flex flex-col">
                <div>
                    <strong>Tattoo {index + 1}</strong> ({tattoo.tattoo_type})
                </div>
                <div>{tattoo.notes}</div>
                <div>Est. tid: {tattoo.estimated_duration} min</div>
                <div>Est. pris: {tattoo.estimated_price} kr</div>
                {tattoo.booking_images[0] && (
                    <img
                        src={tattoo.booking_images[0].image_url}
                        alt={`Tattoo ${index + 1}`}
                        style={{ maxWidth: 200, marginTop: 8 }}
                    />
                )}
            </div>
            <div className="flex justify-between w-full mb-2">
                <button
                    onClick={() => setIndex(i => Math.max(i - 1, 0))}
                    disabled={index === 0}
                >
                    ←
                </button>
                <span>
                    {index + 1} / {tattoos.length}
                </span>
                <button
                    onClick={() => setIndex(i => Math.min(i + 1, tattoos.length - 1))}
                    disabled={index === tattoos.length - 1}
                >
                    →
                </button>
            </div>
        </div>
    );
}
