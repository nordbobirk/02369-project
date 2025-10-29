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

// TODO: lav boksen mindre høj (ifht. BookingInfo boxen) og mere bred (så der er plads til billeder).
//      min idé er at Andreas notes skal kunne stå under tattoo info boksen.
//      den skal nok også være som et card - ellers bliver det nok ved at se mærkeligt ud.
// TODO: Lav tilføj billeder - lige nu er det kun placeringen og det er lavet forkert..

export function TattooInfo({ tattoos }: TattooInfoProps) {
    const [index, setIndex] = useState(0);

    if (!tattoos.length) return <div>Ingen tattoveringer</div>;

    const tattoo = tattoos[index];

    return (
        <div className="border rounded p-4 flex flex-col min-w-[300px] relative">
            <div className="flex flex-col">
                <div>
                    Tattoo {index + 1} ({tattoo.tattoo_type})
                </div>
                <div>{tattoo.notes}</div>
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
                <div>
                    Est. tid: {tattoo.estimated_duration} minutter
                </div>
                <div>
                    Est. pris: {tattoo.estimated_price} kr
                </div>
            </div>
            {tattoo.booking_images[0] && (
                <div className="absolute top-4 right-4">
                    <img
                        src={tattoo.booking_images[0].image_url}
                        alt={`Tattoo ${index + 1}`}
                        style={{ maxWidth: 200, borderRadius: 12 }}
                    />
                </div>
            )}
            <div className="flex justify-between w-full mb-2 mt-4">
                {/*TODO: fix os vi (← →) er ugly as fuck... */}
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

