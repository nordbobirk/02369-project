// src/app/dashboard/view_booking/[id]/TattooImages.tsx
"use client";

import { useState } from "react";

export function TattooImages({ images }: { images?: { id: number; image_url: string }[] }) {
    const [index, setIndex] = useState(0);

    if (!images || !images.length) {
        return (
            <div className="p-3 border border-black rounded-lg text-center text-sm">
                No images
            </div>
        );
    }

    const len = images.length;
    const safeIndex = ((index % len) + len) % len;
    const current = images[safeIndex];
    // TODO: test with real images - maybe add some 'fullscreen' functionality for view of details or something.

    return (
        <div className="p-2 border border-black rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-48 w-full flex-shrink-0">
                    <div className="full overflow-hidden rounded">
                        <img
                            src={current.image_url}
                            alt={`Tattoo image ${current.id}`}
                            className="object-cover w-full h-full"
                            loading="lazy"
                        />
                    </div>

                    <div className="px-0 pb-0 mt-3 flex justify-between items-center gap-4">
                        <button
                            onClick={() =>
                                setIndex(i =>
                                    len <= 1 ? 0 : (i - 1 + len) % len
                                )
                            }
                            className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                            aria-label="Previous image"
                        >
                            ←
                        </button>

                        <div className="text-sm text-muted-foreground">
                            {safeIndex + 1} / {len}
                        </div>

                        <button
                            onClick={() =>
                                setIndex(i =>
                                    len <= 1 ? 0 : (i + 1) % len
                                )
                            }
                            className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                            aria-label="Next image"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
